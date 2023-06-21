import { connectWallet } from "@/services";
import { type Chat, type Message, type DraftChat } from "@/interfaces/Chat";
import { type DraftPersona, type Persona } from "@/interfaces/Persona";
import type { Signer } from "ethers";
import { create } from "ipfs-http-client";
import {
  CREATE_PERSONA_GO_PRICE,
  NEW_POST_GO_PRICE,
  NEW_POST_REP_PRICE,
  VOTE_GO_PRICE,
} from "@/constants";
import { type Post, type PostPending } from "@/interfaces/Post";
import { type TransactionRecord } from "@/interfaces/Transaction";
import type { Adapter } from "..";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  updateDoc,
  arrayUnion,
  where,
  arrayRemove,
} from "firebase/firestore";
import { subscribeAccountChanged, subscribeChainChanged } from "../utils";
import {
  chatFromDB,
  chatToDB,
  personaFromDB,
  personaToDB,
  postFromDB,
  postPendingFromDB,
} from "./db-adapter";
import { useTokenContext } from "@/context/TokenContext";
import { useEffect } from "react";
import { usePersonaContext } from "@/context/PersonaContext";
import { useProfileContext } from "@/context/ProfileContext";
import { useHistoryContext } from "@/context/HistoryContext";
import { useChatContext } from "@/context/ChatContext";
import { usePostContext } from "@/context/PostContext";
import { Profile } from "@/interfaces/Profile";

// FIXME: no idea where whe should put these so that they don't leak. I can limit to some specific origin I guess
const IPFS_AUTH =
  "Basic Mk5Nbk1vZUNSTWMyOTlCQjYzWm9QZzlQYTU3OjAwZTk2MmJjZTBkZmQxZWQxNGNhNmY1M2JiYjYxMTli";
const IPFS_GATEWAY = "https://kurate.infura-ipfs.io/ipfs";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH2EKqPTP3MSJKd1jeHfZsiqs2MxxqaUs",
  authDomain: "kurate-demo.firebaseapp.com",
  projectId: "kurate-demo",
  storageBucket: "kurate-demo.appspot.com",
  messagingSenderId: "705467445059",
  appId: "1:705467445059:web:e848928a33d2a27b7b49f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function epochCounter(): () => void {
  const { tokenData, updateTokenData } = useTokenContext();

  useEffect(() => {
    const interval = setInterval(() => {
      const { epochDuration, ...rest } = tokenData;
      const newTimeToEpoch = epochDuration - (Date.now() % epochDuration);
      updateTokenData({ ...rest, epochDuration, timeToEpoch: newTimeToEpoch });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [updateTokenData]);

  return () => {};
}

export class Firebase implements Adapter {
  private ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: IPFS_AUTH,
    },
  });
  private subscriptions: Array<() => unknown> = [];
  private userSubscriptions: Array<() => unknown> = [];
  private votes = new Map<string, { promote: string[]; demote: string[] }>();
  private participants = new Map<string, string[]>();
  private postIdParticipant = new Map<string, string>();

  async start() {
    const { personaData, updatePersonaData } = usePersonaContext();
    const { profile: p } = useProfileContext();
    const { tokenData, updateTokenData } = useTokenContext();
    const { updateHistoryData } = useHistoryContext();
    const { chatData, updateChatData } = useChatContext();

    const personasQuery = query(collection(db, "personas"));
    const unsubscribePersonas = onSnapshot(personasQuery, (data) => {
      const all = new Map<string, Persona>();
      data.docs.forEach((e) => {
        const dbPersona = e.data() as DBPersona;
        const persona = personaFromDB(dbPersona, e.id);
        this.participants.set(e.id, dbPersona.participants);
        all.set(e.id, persona);
      });

      updatePersonaData({ ...personaData, all, loading: false });
    });
    this.subscriptions.push(unsubscribePersonas);

    const unsubscribeUser = () => {
      if (p.signer && this.userSubscriptions.length === 0) {
        const userSnapshot = doc(db, `users/${p.address}`);
        const subscribeTokens = onSnapshot(userSnapshot, (res) => {
          type UserRes = {
            go: number;
            repStaked: number;
            repTotal: number;
            favorite?: string[];
            draft?: DraftPersona[];
          };
          const { go, repStaked, repTotal, favorite, draft } =
            res.data() as UserRes;

          updateTokenData({
            ...tokenData,
            go: go ?? 5000, // FIXME: this should be DEFAULT_GO_AMOUNT
            repStaked: repStaked ?? 0,
            repTotal: repTotal ?? 5000, // FIXME: this should be 0
          });

          updatePersonaData({
            ...personaData,
            favorite: favorite ?? [],
            draft: draft ?? [],
          });
        });
        this.userSubscriptions.push(subscribeTokens);

        const transactionSnapshot = collection(
          db,
          `users/${p.address}/transactions`
        );
        const subscribeTransactions = onSnapshot(transactionSnapshot, (res) => {
          const trns: TransactionRecord[] = [];
          res.docs.forEach((d) => {
            const transactionsDb = d.data() as DBTransaction;
            trns.push(transactionsDb);
          });
          updateHistoryData({ transactions: trns });
        });
        this.userSubscriptions.push(subscribeTransactions);

        const chatsSnapshot = query(
          collection(db, `chats`),
          where("users", "array-contains", p.address)
        );
        const subscribeChats = onSnapshot(chatsSnapshot, (res) => {
          const newChats = new Map<string, Chat>();
          res.docs.forEach((d) => {
            const data = d.data() as DBChat;
            const persona = personaData.all.get(data.personaId);
            if (!persona) return;
            const chat = chatFromDB(data, persona, d.id);
            newChats.set(d.id, chat);
          });
          updateChatData({ ...chatData, chats: newChats, loading: false });
        });
        this.userSubscriptions.push(subscribeChats);
      }
      if (!p.signer && this.userSubscriptions.length !== 0) {
        this.userSubscriptions.forEach((s) => s());
        this.userSubscriptions = [];
      }
    };

    this.subscriptions.push(unsubscribeUser);
    this.subscriptions.push(epochCounter());
    this.subscriptions.push(subscribeAccountChanged());
    this.subscriptions.push(subscribeChainChanged());
  }

  stop() {
    this.subscriptions.forEach((s) => s());
    this.userSubscriptions.forEach((s) => s());
  }

  async addPersonaToFavorite(groupId: string): Promise<void> {
    const { profile } = useProfileContext();
    const address = profile.address;
    if (!address) return;
    const userDoc = doc(db, `users/${address}`);
    await updateDoc(userDoc, { favorite: arrayUnion(groupId) });
  }

  async removePersonaFromFavorite(groupId: string): Promise<void> {
    const { profile } = useProfileContext();
    const address = profile.address;
    if (!address) return;
    const userDoc = doc(db, `users/${address}`);
    await updateDoc(userDoc, { favorite: arrayRemove(groupId) });
  }

  addPersonaDraft(draftPersona: DraftPersona): Promise<number> {
    return new Promise((resolve) => {
      const { personaData, updatePersonaData } = usePersonaContext();
      const newDraft = [...personaData.draft, draftPersona];

      const { profile } = useProfileContext();
      const address = profile.address;

      if (address) {
        const userDoc = doc(db, `users/${address}`);
        updateDoc(userDoc, { draft: newDraft });
      }

      resolve(newDraft.length - 1);

      updatePersonaData({ ...personaData, draft: newDraft });
    });
  }

  updatePersonaDraft(index: number, draftPersona: DraftPersona): Promise<void> {
    return new Promise((resolve) => {
      const { personaData, updatePersonaData } = usePersonaContext();
      const { profile } = useProfileContext();

      let draft = personaData.draft;
      draft[index] = draftPersona;
      const address = profile.address;

      if (address) {
        const userDoc = doc(db, `users/${address}`);
        updateDoc(userDoc, { draft: draft });
      }

      resolve();

      updatePersonaData({ ...personaData, draft });
    });
  }

  deleteDraftPersona(index: number): Promise<void> {
    return new Promise((resolve) => {
      const { personaData, updatePersonaData } = usePersonaContext();
      const { profile } = useProfileContext();
      const newDraft = personaData.draft.filter((_, i) => i !== index);
      const address = profile.address;

      if (address) {
        const userDoc = doc(db, `users/${address}`);
        updateDoc(userDoc, { draft: newDraft });
      }

      resolve();

      updatePersonaData({ ...personaData, draft: newDraft });
    });
  }

  async publishPersona(
    draftPersona: DraftPersona,
    signer: Signer
  ): Promise<string> {
    await signer.signMessage('This "transaction" publishes persona');
    const address = await signer.getAddress();
    const personasCollection = collection(db, "personas");
    const { posts } = draftPersona;
    const personaDoc = await addDoc(
      personasCollection,
      personaToDB(draftPersona, [address])
    );

    const postCollection = collection(db, `personas/${personaDoc.id}/posts`);
    posts.forEach((p) => {
      const dbPost: DBPost = {
        ...p,
        address,
      };
      addDoc(postCollection, dbPost);
    });

    const profileCollection = collection(db, `users/${address}/transactions`);
    const transaction: DBTransaction = {
      timestamp: Date.now(),
      goChange: -CREATE_PERSONA_GO_PRICE,
      repChange: 0,
      personaId: personaDoc.id,
      type: "publish persona",
    };
    await addDoc(profileCollection, transaction);

    const { tokenData } = useTokenContext();
    const user = doc(db, `users/${address}`);
    setDoc(
      user,
      {
        address,
        go: tokenData.go - CREATE_PERSONA_GO_PRICE,
        repTotal: tokenData.repTotal,
        repStaked: tokenData.repStaked,
      },
      { merge: true }
    );

    const { personaData, updatePersonaData } = usePersonaContext();

    const newDraft = personaData.draft.filter((d) => d !== draftPersona);
    const userDoc = doc(db, `users/${address}`);
    updateDoc(userDoc, { draft: newDraft });

    updatePersonaData({ ...personaData, draft: newDraft });

    return personaDoc.id;
  }

  async signIn(
    profile: Profile,
    updateProfile: (newProfile: Profile) => void
  ): Promise<void> {
    const signer = await connectWallet();
    const address = await signer.getAddress();
    const userDoc = doc(db, `users/${address}`);

    setDoc(userDoc, { address, lastSignIn: Date.now() }, { merge: true });
    updateProfile({ ...profile, signer, address });
  }

  async uploadPicture(picture: string): Promise<string> {
    const blob = await (await fetch(picture)).blob();
    const res = await this.ipfs.add(blob);

    return res.cid.toString();
  }

  getPicture(cid: string): string {
    return `${IPFS_GATEWAY}/${cid}`;
  }

  async publishPost(
    groupId: string,
    text: string,
    images: string[],
    signer: Signer
  ): Promise<string> {
    const address = await signer.getAddress();
    const isMemberOfGroup = this.participants.get(groupId)?.includes(address);

    const post: DBPostPending = {
      timestamp: Date.now(),
      text,
      images,
      promote: [],
      demote: [],
      address,
    };

    if (!isMemberOfGroup) {
      await signer.signMessage('This "transaction" joins the persona');
      const personaDoc = doc(db, `personas/${groupId}`);
      updateDoc(personaDoc, { participants: arrayUnion(address) });
    }

    await signer.signMessage('This "transaction" publishes a post to pending');

    // Store post to pending
    const pendingPosts = collection(db, `personas/${groupId}/pending`);
    const postDoc = await addDoc(pendingPosts, post);

    const profileCollection = collection(db, `users/${address}/transactions`);

    const transaction: DBTransaction = {
      timestamp: Date.now(),
      goChange: -NEW_POST_GO_PRICE,
      repChange: -NEW_POST_REP_PRICE,
      personaId: groupId,
      type: "publish post",
    };
    await addDoc(profileCollection, transaction);

    const { tokenData } = useTokenContext();
    const user = doc(db, `users/${address}`);
    setDoc(
      user,
      {
        address,
        go: tokenData.go - NEW_POST_GO_PRICE,
        repTotal: tokenData.repTotal,
        repStaked: tokenData.repStaked + NEW_POST_REP_PRICE,
      },
      { merge: true }
    );

    return postDoc.id;
  }

  async subscribePersonaPosts(groupId: string): Promise<() => unknown> {
    const { postData, updatePostData } = usePostContext();
    const { profile } = useProfileContext();
    const address = profile.address;

    // Sets loading to true if the data is not yet retrieved
    const personaPostData = postData.get(groupId);
    if (!personaPostData) {
      const updatedPostData = new Map(postData);
      updatedPostData.set(groupId, {
        approved: [],
        pending: [],
        loading: true,
        error: undefined,
      });
      updatePostData(updatedPostData);
    }

    const pendingCollection = collection(db, `personas/${groupId}/pending`);
    const postsCollection = collection(db, `personas/${groupId}/posts`);

    const subscribePending = onSnapshot(pendingCollection, (res) => {
      const newPending: PostPending[] = [];

      res.docs.forEach((d) => {
        const postDb = d.data() as DBPostPending;
        this.votes.set(d.id, {
          promote: postDb.promote,
          demote: postDb.demote,
        });
        this.postIdParticipant.set(d.id, postDb.address);
        newPending.push(postPendingFromDB(postDb, d.id, address));
      });

      const personaPostData = postData.get(groupId);
      const pending = newPending;
      const approved = personaPostData?.approved ?? [];
      const updatedPostData = new Map(postData);
      updatedPostData.set(groupId, { loading: false, approved, pending });

      updatePostData(updatedPostData);
    });

    // Ensures that votuse and whether the post is yours is updated after user logs in
    const subscribeProfileChangePending = () => {
      if (address) {
        const updatedPostData = new Map(postData);

        const personaPostData = updatedPostData.get(groupId);
        if (personaPostData) {
          const pending = personaPostData.pending.map((p) => {
            if (p.postId === undefined) return p;
            const vt = this.votes.get(p.postId);
            if (vt === undefined) return p;
            let yourVote: "+" | "-" | undefined = undefined;
            if (vt.promote.includes(address)) yourVote = "+";
            if (vt.demote.includes(address)) yourVote = "-";

            const postSender = this.postIdParticipant.get(p.postId);

            return { ...p, myPost: postSender === address, yourVote };
          });

          updatedPostData.set(groupId, { ...personaPostData, pending });
          updatePostData(updatedPostData);
        }
      }
    };

    const subscribePosts = onSnapshot(postsCollection, (res) => {
      const newPostst: Post[] = [];

      res.docs.forEach((d) => {
        const postDb = d.data() as DBPost;
        this.postIdParticipant.set(d.id, postDb.address);
        newPostst.push(postFromDB(postDb, d.id, address));
      });
      const updatedPostData = new Map(postData);

      const personaPostData = updatedPostData.get(groupId);
      const pending = personaPostData?.pending ?? [];
      const approved = newPostst;

      updatedPostData.set(groupId, { loading: false, approved, pending });
      updatePostData(updatedPostData);
    });

    return () => {
      subscribeProfileChangePending();
      subscribePending();
      subscribePosts();
    };
  }

  async voteOnPost(
    groupId: string,
    postId: string,
    vote: "+" | "-",
    signer: Signer
  ) {
    const promoteDemote: "promote" | "demote" =
      vote === "+" ? "promote" : "demote";
    await signer.signMessage(
      `By confirming this "transaction" you are casting ${promoteDemote} vote on the post`
    );
    const address = await signer.getAddress();
    const { postData } = usePostContext();
    const { tokenData } = useTokenContext();

    const postInfo = postData
      .get(groupId)
      ?.pending.find((p) => p.postId === postId);
    if (!postData) return;

    const postDoc = doc(db, `personas/${groupId}/pending/${postInfo?.postId}`);
    updateDoc(postDoc, {
      [promoteDemote]: arrayUnion(address),
    });

    const user = doc(db, `users/${address}`);
    setDoc(
      user,
      { address, go: tokenData.go - VOTE_GO_PRICE },
      { merge: true }
    );

    const profileCollection = collection(db, `users/${address}/transactions`);

    const transaction: DBTransaction = {
      timestamp: Date.now(),
      goChange: -VOTE_GO_PRICE,
      repChange: 0,
      type: promoteDemote,
      personaId: groupId,
    };

    await addDoc(profileCollection, transaction);
  }

  async startChat(chat: DraftChat): Promise<string> {
    const { profile } = useProfileContext();
    const address = profile.address;
    const postSender = this.postIdParticipant.get(chat.post.postId);

    if (!address) throw new Error("You need to be logged in to start a chat");
    if (!postSender) throw new Error("Info about original poster is missing");
    if (!chat.post.postId) throw new Error("PostId is missing");
    if (!chat.persona.personaId) throw new Error("PersonaId is missing");

    const dbChat = chatToDB(chat, address, postSender);

    const chatCollection = collection(db, `/chats`);
    const chatDoc = await addDoc(chatCollection, dbChat);

    return chatDoc.id;
  }

  async sendChatMessage(chatId: string, text: string): Promise<void> {
    const { profile } = useProfileContext();
    const address = profile.address;

    if (!address) throw new Error("ChatId or address is missing");

    const message: Message = {
      timestamp: Date.now(),
      text,
      address,
    };

    const chatDoc = doc(db, `chats/${chatId}`);
    updateDoc(chatDoc, { messages: arrayUnion(message), lastMessage: text });
  }
}
