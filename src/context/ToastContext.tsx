import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Toast {
    id: number;
    message: string;
    type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = ++toastIdCounter;
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3.5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
