import { useState, createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  googleLogin: (name: string, email: string, googleId: string, avatar?: string) => Promise<User>;
  googleSignup: (name: string, email: string, googleId: string, avatar?: string) => Promise<User>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// auto gen avatar
const generateAvatar = (seed: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('shrawan_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

    // Centralized auth storage
  const saveAuthData = (userData: User) => {
    const avatar =
      userData.avatar && userData.avatar.trim() !== ''
        ? userData.avatar
        : generateAvatar(userData.email);

    const finalUser: User = {
      ...userData,
      avatar,
    };

    setUser(finalUser);
    localStorage.setItem('shrawan_user', JSON.stringify(finalUser));
  };

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/ShrawanHandicraftsFYP/backend/api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (data.status !== "success") {
        throw new Error(data.message || "Invalid credentials");
      }

      saveAuthData(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/ShrawanHandicraftsFYP/backend/api/signup.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();
      if (data.status !== "success") {
        throw new Error(data.message || "Signup failed");
      }

      saveAuthData(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  // For login page checks if user exists
  const googleLogin = async (
    name: string,
    email: string,
    googleId: string,
    avatar?: string
  ): Promise<User> => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/ShrawanHandicraftsFYP/backend/api/google-login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            google_id: googleId,
            avatar,
          }),
        }
      );

      const data = await res.json();
      if (data.status !== "success") {
        throw new Error(data.message);
      }

      saveAuthData(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  // For signup page creates new user
  const googleSignup = async (
    name: string,
    email: string,
    googleId: string,
    avatar?: string
  ): Promise<User> => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/ShrawanHandicraftsFYP/backend/api/signup.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            google_id: googleId,
            avatar,
            is_google_auth: true,
          }),
        }
      );

      const data = await res.json();
      if (data.status !== "success") {
        throw new Error(data.message);
      }

      saveAuthData(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shrawan_user');
  };

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('shrawan_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        googleSignup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
