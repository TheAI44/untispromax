/**
 * Shared TypeScript Types & Interfaces
 * Used across all screens and contexts
 */

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  isAdmin?: boolean;
}

export interface Homework {
  id: string;
  userId: string;
  subject: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachments?: string[];
  timestamp: Date;
  readBy?: string[];
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
  messages: ChatMessage[];
}

export interface Timetable {
  day: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  doppelstunde: boolean;
}

export interface AppContexts {
  auth: AuthContextType;
  data: DataContextType;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export interface DataContextType {
  homework: Homework[];
  events: Event[];
  chats: Chat[];
  loadingHomework: boolean;
  loadingEvents: boolean;
  loadingChats: boolean;
  addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHomework: (id: string, updates: Partial<Homework>) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;
  toggleHomeworkDone: (id: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  createChat: (participants: string[], participantNames: string[]) => Promise<void>;
}
