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
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------------- LOGIN ----------------
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

      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
        role: data.user.role,
      };

      setUser(userData);
      return userData;

    } finally {
      setLoading(false);
    }
  };

  // ---------------- SIGNUP (FIXED) ----------------
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
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

      // ❗ THIS IS THE KEY FIX
      if (data.status !== "success") {
        throw new Error(data.message || "Signup failed");
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
        role: data.user.role,
      };

      setUser(userData);
      return userData;

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
