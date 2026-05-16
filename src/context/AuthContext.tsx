import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User, Lecturer } from '../types';

interface AuthContextType {
  user: User | null;
  lecturer: Lecturer | null;
  loading: boolean;
  signInWithGoogle: (role: 'student' | 'lecturer') => Promise<void>;
  signOut: () => Promise<void>;
  signInMockUser: (role: 'student' | 'lecturer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setFirebaseUser(currUser);
      if (currUser) {
        // Fetch user document to get role
        try {
          const userDoc = await getDoc(doc(db, 'users', currUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role === 'student') {
              setUser({
                id: currUser.uid,
                name: data.name || currUser.displayName || 'Student',
                email: data.email || currUser.email || '',
                role: 'student',
                plan: {
                  id: 'premium',
                  name: 'Premium',
                  price: '99€',
                  priceDetails: '/ Monat',
                  description: 'Premium plan',
                  features: [],
                  ctaText: '',
                  ctaVariant: 'primary'
                }
              });
              setLecturer(null);
            } else if (data.role === 'lecturer') {
              setLecturer({
                id: currUser.uid,
                name: data.name || currUser.displayName || 'Dozent',
                email: data.email || currUser.email || '',
                institution: 'FH Gesundheitsberufe'
              });
              setUser(null);
            }
          } else {
             // Fallback if no doc exists yet
             setUser(null);
             setLecturer(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUser(null);
        setLecturer(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (role: 'student' | 'lecturer') => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user doc exists, if not create it
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: role,
          name: user.displayName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInMockUser = (role: 'student' | 'lecturer') => {
    if (role === 'student') {
      setUser({
        id: '1', 
        name: 'Max Mustermann', 
        email: 'student@koerperfluss.at', 
        role: 'student',
        plan: {
          id: 'premium',
          name: 'Premium: Den Zusammenhang erkennen',
          price: '99€',
          priceDetails: '/ Monat',
          description: 'Das ultimative Paket für maximale Autonomie und professionelle Werkzeuge zur Selbst-Analyse.',
          features: [],
          ctaText: 'Premium werden',
          ctaVariant: 'secondary',
        }
      });
      setLecturer(null);
    } else {
      setLecturer({
        id: 'lec1', 
        name: 'Prof. Dr. Eva Meier', 
        email: 'dozent@koerperfluss.at', 
        institution: 'FH Gesundheitsberufe' 
      });
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
    setUser(null);
    setLecturer(null);
  };

  return (
    <AuthContext.Provider value={{ user, lecturer, loading, signInWithGoogle, signOut, signInMockUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
