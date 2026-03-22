import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../services/firebase/config';

interface User {
  uid: string;
  email: string;
  name: string;
  photo?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string, name: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    // Check both Firebase auth and persisted session
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Load user doc from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User;
            setUser({ uid: firebaseUser.uid, ...userData });
            
            // Persist to AsyncStorage for quick app startup
            await AsyncStorage.setItem(
              '@app/user',
              JSON.stringify({ uid: firebaseUser.uid, ...userData })
            );
          } else {
            // New user, create minimal doc
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: '',
              isAdmin: false,
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: '',
            isAdmin: false,
          });
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem('@app/user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, db]);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document
    const userDocRef = doc(db, 'users', result.user.uid);
    const newUser: User = {
      uid: result.user.uid,
      email,
      name,
      isAdmin: false,
    };
    await setDoc(userDocRef, newUser);
    setUser(newUser);
    
    return result;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { ...user, ...updates }, { merge: true });
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
