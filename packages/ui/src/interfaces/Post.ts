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

export interface PostInfo {
  approved: Post[];
  pending: PostPending[];
  loading: boolean;
  error?: Error;
}

export interface PostData {
  postData: Map<string, PostInfo>;
}
