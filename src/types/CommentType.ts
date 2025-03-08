export interface Comment {
  id: string;
  userUid: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
  parentCommentId : string | null;
  replies ?: Comment[];
}