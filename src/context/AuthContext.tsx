import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export type Role = 'ADMIN' | 'CONSUMER' | null;

export interface User {
    id: string;
    username: string;
    role: Role;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Read from localStorage on initial load to persist session
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('peak_auth_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('peak_auth_user', JSON.stringify(userData));
        if (userData.token) {
            localStorage.setItem('peak_auth_token', userData.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('peak_auth_user');
        localStorage.removeItem('peak_auth_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
