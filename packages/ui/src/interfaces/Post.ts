export interface DraftPost {
  timestamp: number;
  text: string;
  images: string[];
}

export interface Post extends DraftPost {
  postId: string;
  myPost?: boolean;
}

export interface PostPending extends Post {
  yourVote?: "+" | "-";
}

export interface PostData {
  postData: Map<
    string,
    {
      approved: Post[];
      pending: PostPending[];
      loading: boolean;
      error?: Error;
    }
  >;
}
