import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
const ToastContext = createContext(null);
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const showToast = useCallback((type, text, duration = 3000) => {
        setToast({ type, text });
        if (duration > 0) {
            setTimeout(() => {
                setToast(null);
            }, duration);
        }
    }, []);
    const dismissToast = useCallback(() => {
        setToast(null);
    }, []);
    const success = (text) => showToast('success', text);
    const error = (text) => showToast('error', text);
    return (
        <ToastContext.Provider value={{ showToast, dismissToast, success, error }}>
            {children}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className={cn(
                            "fixed top-6 right-6 z-[200] flex items-center gap-4 p-4 rounded-xl shadow-2xl border backdrop-blur-md min-w-[320px]",
                            toast.type === 'success'
                                ? "bg-white/90 border-green-200 text-green-800 dark:bg-zinc-900/90 dark:border-green-900"
                                : "bg-white/90 border-red-200 text-red-800 dark:bg-zinc-900/90 dark:border-red-900"
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                            toast.type === 'success' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</h4>
                            <p className="text-sm opacity-90">{toast.text}</p>
                        </div>
                        <button onClick={dismissToast} className="text-muted-foreground hover:text-foreground">
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    );
};
