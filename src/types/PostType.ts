export interface Post {
    title: string;
    content: string;
    timestamp: { seconds: number; nanoseconds: number };
    author: string; // New field
    categories: string[]; // New field
}