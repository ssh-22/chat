export interface MessageType {
  authorId: string;
  authorName: string;
  content: string;
  timestamp: number;
}

export interface MessageProps extends MessageType {
  userId: string | null;
}
