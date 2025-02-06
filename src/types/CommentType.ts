export interface Comment {
  id: string;
  email: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}