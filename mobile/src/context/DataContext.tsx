import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useAuth } from './AuthContext';
import { normalizeMensaplanRecord } from '../utils/helpers';

// Type definitions (import from shared types)
export interface Homework {
  id: string;
  type: 'Arbeit' | 'Test' | 'Hausaufgabe' | 'Projekt';
  subject: string;
  desc: string;
  date: string;
  done: boolean;
  createdBy: string;
  attachments?: { name: string; url: string }[];
}

export interface Event {
  id: string;
  type: 'Event' | 'Termin';
  subject: string;
  desc: string;
  date: string;
  createdBy: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text?: string;
  image?: string;
  file?: { name: string; url: string };
  files?: { name: string; url: string; type: string }[];
  ts: number;
  replyTo?: string;
}

export interface Chat {
  id: string;
  type: 'dm' | 'group' | 'class';
  name?: string;
  members: string[];
  messages: ChatMessage[];
  mutedUsers?: string[];
}

/** Matches web app `index.html` mensaplan shape: mensaplan[YYYY-MM-DD].meals */
export interface MensaMeal {
  name: string;
  allergens?: string;
  vegan?: boolean;
}

export interface MensaDayPlan {
  meals: MensaMeal[];
  validUntil?: number;
}

interface DataContextType {
  homework: Homework[];
  events: Event[];
  chats: Record<string, Chat>;
  /** Keyed by ISO date string YYYY-MM-DD (same as web) */
  mensaplan: Record<string, MensaDayPlan>;
  loading: boolean;
  error: string | null;

  // Homework mutations
  addHomework: (hw: Omit<Homework, 'id' | 'createdBy'>) => Promise<void>;
  updateHomework: (id: string, updates: Partial<Homework>) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;
  toggleHomeworkDone: (id: string, done: boolean) => Promise<void>;

  // Event mutations
  addEvent: (event: Omit<Event, 'id' | 'createdBy'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Chat mutations
  sendMessage: (chatId: string, msg: Omit<ChatMessage, 'id' | 'ts'>) => Promise<void>;
  createChat: (chat: Omit<Chat, 'id' | 'messages'>) => Promise<string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [mensaplan, setMensaplan] = useState<Record<string, MensaDayPlan>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up real-time listeners
  useEffect(() => {
    if (!user) {
      setHomework([]);
      setEvents([]);
      setChats({});
      setMensaplan({});
      return;
    }

    setLoading(true);
    const unsubscribers: Array<() => void> = [];

    try {
      // Homework / events / chats: single Firestore docs with field `value` (same as web `index.html` — not subcollections)
      unsubscribers.push(
        onSnapshot(
          doc(db, 'appdata', 'homework'),
          (snapshot) => {
            const v = snapshot.exists() ? snapshot.data()?.value : [];
            const hw = (Array.isArray(v) ? v : []) as Homework[];
            setHomework(hw);
          },
          (err) => {
            console.error('Error loading homework:', err);
            setError('Failed to load homework');
          }
        )
      );

      unsubscribers.push(
        onSnapshot(
          doc(db, 'appdata', 'events'),
          (snapshot) => {
            const v = snapshot.exists() ? snapshot.data()?.value : [];
            const ev = (Array.isArray(v) ? v : []) as Event[];
            setEvents(ev);
          },
          (err) => {
            console.error('Error loading events:', err);
            setError('Failed to load events');
          }
        )
      );

      unsubscribers.push(
        onSnapshot(
          doc(db, 'appdata', 'chats'),
          (snapshot) => {
            const v = snapshot.exists() ? snapshot.data()?.value : {};
            const chatsData =
              v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, Chat>) : {};
            setChats(chatsData);
          },
          (err) => {
            console.error('Error loading chats:', err);
            setError('Failed to load chats');
          }
        )
      );

      // Mensaplan: single document appdata/mensaplan, field `value` (object by date key) — same as web
      unsubscribers.push(
        onSnapshot(
          doc(db, 'appdata', 'mensaplan'),
          (snapshot) => {
            const raw = snapshot.exists() ? snapshot.data()?.value : undefined;
            const next = normalizeMensaplanRecord(raw) as Record<string, MensaDayPlan>;
            setMensaplan(next);
          },
          (err) => {
            console.error('Error loading mensaplan:', err);
          }
        )
      );

      setLoading(false);
    } catch (err) {
      console.error('Error setting up listeners:', err);
      setError('Failed to set up data listeners');
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user]);

  // Homework mutations
  const addHomework = async (hw: Omit<Homework, 'id' | 'createdBy'>) => {
    try {
      const ref = doc(db, 'appdata', 'homework');
      const snap = await getDoc(ref);
      const cur = snap.exists() ? snap.data()?.value : [];
      const list = Array.isArray(cur) ? [...cur] : [];
      const id = `hw-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      list.push({
        ...hw,
        id,
        createdBy: user?.uid || 'system',
      } as Homework);
      await setDoc(ref, { value: list }, { merge: true });
    } catch (err) {
      console.error('Error adding homework:', err);
      setError('Failed to add homework');
      throw err;
    }
  };

  const updateHomework = async (id: string, updates: Partial<Homework>) => {
    try {
      const ref = doc(db, 'appdata', 'homework');
      const snap = await getDoc(ref);
      const cur = snap.exists() ? snap.data()?.value : [];
      const list = Array.isArray(cur) ? ([...cur] as Homework[]) : [];
      const idx = list.findIndex((h) => h.id === id);
      if (idx < 0) throw new Error('Homework not found');
      list[idx] = { ...list[idx], ...updates };
      await setDoc(ref, { value: list }, { merge: true });
    } catch (err) {
      console.error('Error updating homework:', err);
      setError('Failed to update homework');
      throw err;
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      const ref = doc(db, 'appdata', 'homework');
      const snap = await getDoc(ref);
      const cur = snap.exists() ? snap.data()?.value : [];
      const list = (Array.isArray(cur) ? cur : []).filter((h: Homework) => h.id !== id);
      await setDoc(ref, { value: list }, { merge: true });
    } catch (err) {
      console.error('Error deleting homework:', err);
      setError('Failed to delete homework');
      throw err;
    }
  };

  const toggleHomeworkDone = async (id: string, done: boolean) => {
    await updateHomework(id, { done });
  };

  // Event mutations
  const addEvent = async (event: Omit<Event, 'id' | 'createdBy'>) => {
    try {
      const ref = doc(db, 'appdata', 'events');
      const snap = await getDoc(ref);
      const cur = snap.exists() ? snap.data()?.value : [];
      const list = Array.isArray(cur) ? [...cur] : [];
      const id = `ev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      list.push({
        ...event,
        id,
        createdBy: user?.uid || 'system',
      } as Event);
      await setDoc(ref, { value: list }, { merge: true });
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event');
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const ref = doc(db, 'appdata', 'events');
      const snap = await getDoc(ref);
      const cur = snap.exists() ? snap.data()?.value : [];
      const list = Array.isArray(cur) ? ([...cur] as Event[]) : [];
      const idx = list.findIndex((e) => e.id === id);
      if (idx < 0) throw new Error('Event not found');
      list[idx] = { ...list[idx], ...updates };
      await setDoc(ref, { value: list }, { merge: true });
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const ref = doc(db, 'appdata', 'events');
      const snap = await getDoc(ref);
      const cur = snap.exists() ? snap.data()?.value : [];
      const list = (Array.isArray(cur) ? cur : []).filter((e: Event) => e.id !== id);
      await setDoc(ref, { value: list }, { merge: true });
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
      throw err;
    }
  };

  // Chat mutations
  const sendMessage = async (chatId: string, msg: Omit<ChatMessage, 'id' | 'ts'>) => {
    try {
      const chat = chats[chatId];
      if (!chat) throw new Error('Chat not found');

      const newMessage: ChatMessage = {
        ...msg,
        id: `msg-${Date.now()}`,
        ts: Date.now(),
      };

      const messages = [...chat.messages, newMessage];
      const ref = doc(db, 'appdata', 'chats');
      const nextChats = {
        ...chats,
        [chatId]: { ...chat, messages },
      };
      await setDoc(ref, { value: nextChats }, { merge: true });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      throw err;
    }
  };

  const createChat = async (chat: Omit<Chat, 'id' | 'messages'>) => {
    try {
      const ref = doc(db, 'appdata', 'chats');
      const snap = await getDoc(ref);
      const v = snap.exists() ? snap.data()?.value : {};
      const current =
        v && typeof v === 'object' && !Array.isArray(v) ? { ...(v as Record<string, Chat>) } : {};
      const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      current[id] = { ...chat, id, messages: [] } as Chat;
      await setDoc(ref, { value: current }, { merge: true });
      return id;
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('Failed to create chat');
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        homework,
        events,
        chats,
        mensaplan,
        loading,
        error,
        addHomework,
        updateHomework,
        deleteHomework,
        toggleHomeworkDone,
        addEvent,
        updateEvent,
        deleteEvent,
        sendMessage,
        createChat,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
