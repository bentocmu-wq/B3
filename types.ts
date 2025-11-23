export enum Sender {
  USER = 'USER',
  BOT = 'BOT',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export interface SheetData {
  content: string;
  source: 'LIVE' | 'FALLBACK';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}