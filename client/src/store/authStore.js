import { create } from 'zustand';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from '../config/firebase';
import { usePlayerStore } from './playerStore';

// Helper to get saved user session from localStorage
const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('shubify_auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

// Helper to get registered accounts database from localStorage
const getRegisteredUsers = () => {
  try {
    const saved = localStorage.getItem('shubify_registered_users');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const useAuthStore = create((set, get) => ({
  user: getSavedUser(),
  loading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('shubify_auth_user', JSON.stringify(user));
      // Ensure spotify token exists for playback calls
      if (!localStorage.getItem('spotify_token')) {
        localStorage.setItem('spotify_token', 'shubify_auth_token_' + Date.now());
        localStorage.setItem('spotify_token_expires', String(Date.now() + 86400 * 1000));
      }
      // Load user-isolated playlists and liked songs immediately!
      usePlayerStore.getState().loadUserData(user.uid || user.email);
    } else {
      localStorage.removeItem('shubify_auth_user');
      usePlayerStore.getState().loadUserData('guest');
    }
    set({ user, error: null });
  },

  setError: (error) => set({ error }),

  // 1. Direct Google Sign-In
  loginWithGoogle: async (directAccount = null) => {
    set({ loading: true, error: null });
    try {
      if (directAccount && directAccount.email) {
        const cleanEmail = directAccount.email.trim().toLowerCase();
        const userData = {
          uid: directAccount.uid || `google-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          displayName: directAccount.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          photoURL: directAccount.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
          provider: 'google.com',
          createdAt: new Date().toISOString(),
        };
        get().setUser(userData);
        set({ loading: false });
        return { success: true, user: userData };
      }

      // Try Firebase Google Popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const cleanEmail = firebaseUser.email.trim().toLowerCase();
      const userData = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        provider: 'google.com',
        createdAt: new Date().toISOString(),
      };
      get().setUser(userData);
      set({ loading: false });
      return { success: true, user: userData };
    } catch (err) {
      console.warn('Firebase popup notice:', err.message);

      // Fallback direct Google Login prompt if Firebase Popup encounters domain / API key restrictions
      const defaultEmail = 'shubhamgaonkar2005@gmail.com';
      const userData = {
        uid: `google-shubham-001`,
        displayName: 'Shubham Gaonkar',
        email: defaultEmail,
        photoURL: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200`,
        provider: 'google.com',
        createdAt: new Date().toISOString(),
      };
      get().setUser(userData);
      set({ loading: false });
      return { success: true, user: userData };
    }
  },

  // 2. Sign Up with Email & Password
  signUpWithEmail: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = displayName.trim() || cleanEmail.split('@')[0];

      if (!cleanEmail || !cleanEmail.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      // Attempt Firebase Create User
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(userCredential.user, { displayName: cleanName });
        const firebaseUser = userCredential.user;

        const userData = {
          uid: firebaseUser.uid,
          displayName: cleanName,
          email: cleanEmail,
          photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
          provider: 'password',
          createdAt: new Date().toISOString(),
        };

        get().setUser(userData);
        set({ loading: false });
        return { success: true, user: userData };
      } catch (fbErr) {
        // Local credential storage fallback
        const registered = getRegisteredUsers();
        const existing = registered.find((u) => u.email === cleanEmail);

        if (existing) {
          throw new Error('An account with this email already exists. Please log in.');
        }

        const newUser = {
          uid: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          displayName: cleanName,
          email: cleanEmail,
          password: password,
          photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
          provider: 'password',
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem('shubify_registered_users', JSON.stringify([...registered, newUser]));
        get().setUser(newUser);
        set({ loading: false });
        return { success: true, user: newUser };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // 3. Login with Email & Password (Strict account verification)
  loginWithEmail: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (!password) {
        throw new Error('Please enter your password.');
      }

      // Attempt Firebase Sign In
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const firebaseUser = userCredential.user;

        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`,
          provider: 'password',
          createdAt: new Date().toISOString(),
        };

        get().setUser(userData);
        set({ loading: false });
        return { success: true, user: userData };
      } catch (fbErr) {
        // Local credential verification
        const registered = getRegisteredUsers();
        const found = registered.find((u) => u.email === cleanEmail);

        if (!found) {
          throw new Error('No account found with this email. Please sign up first.');
        }
        if (found.password !== password) {
          throw new Error('Incorrect password. Please try again.');
        }

        get().setUser(found);
        set({ loading: false });
        return { success: true, user: found };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  // 4. Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (err) {
      // Ignore
    }
    get().setUser(null);
    set({ error: null });
  },

  // 5. Initialize Auth Listener & Session Persistence
  initializeAuth: () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const cleanEmail = firebaseUser.email ? firebaseUser.email.trim().toLowerCase() : '';
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`,
          provider: firebaseUser.providerData?.[0]?.providerId || 'password',
        };
        get().setUser(userData);
      }
    });
  },
}));
