import { Post, PostData, PostInfo, PostPending } from "@/interfaces/Post";
import { createContext, useContext, useState } from "react";

interface PostContext extends PostData {
  updatePostData: (newPostData: Map<string, PostInfo>) => void;
  addPending: (post: PostPending, groupId: string) => void;
  addApproved: (post: Post, groupId: string) => void;
}

const PostContext = createContext<PostContext>({
  postData: new Map(),
  updatePostData: () => {},
  addPending: () => {},
  addApproved: () => {},
});

export const PostProvider = ({ children }: any) => {
  const [postData, setPostData] = useState<Map<string, PostInfo>>(new Map());

  const updatePostData = (newPostData: Map<string, PostInfo>) => {
    setPostData(newPostData);
  };

  const addPending = (post: PostPending, groupId: string) => {
    setPostData((prevData) => {
      const personaPostData = prevData.get(groupId);

      if (
        personaPostData?.pending.find(({ postId }) => postId === post.postId)
      ) {
        return prevData;
      }

      const pending = [post, ...(personaPostData?.pending ?? [])];
      const approved = personaPostData?.approved ?? [];
      const newData = new Map(prevData);
      newData.set(groupId, { approved, pending, loading: false });
      return newData;
    });
  };

  const addApproved = (post: Post, groupId: string) => {
    setPostData((prevData) => {
      const personaPostData = prevData.get(groupId);

      if (
        personaPostData?.approved.find(({ postId }) => postId === post.postId)
      ) {
        return prevData;
      }

      const pending = personaPostData?.pending ?? [];
      const approved = [post, ...(personaPostData?.approved ?? [])];
      const newData = new Map(prevData);
      newData.set(groupId, { approved, pending, loading: false });
      return newData;
    });
  };

  const postContext: PostContext = {
    postData,
    updatePostData,
    addPending,
    addApproved,
  };

  return (
    <PostContext.Provider value={postContext}>{children}</PostContext.Provider>
  );
};

export default PostContext;

export const usePostContext = () => useContext<PostContext>(PostContext);
