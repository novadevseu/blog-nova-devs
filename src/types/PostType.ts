export interface Post {
    id : string,
    title: string;
    content: string;
    timestamp: { seconds: number; nanoseconds: number };
    authorUid: string; // New field
    categories: string[]; // New field
}