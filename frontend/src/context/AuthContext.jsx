import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
const AuthContext = createContext(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);
    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        const { token, user: userData, passwordChangeRequired } = response.data;
        const extendedUser = { ...userData, passwordChangeRequired };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(extendedUser));
        setUser(extendedUser);
        return extendedUser;
    };
    const register = async (data) => {
        const response = await authAPI.register(data);
        return response.data;
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isStudent: user?.role === 'STUDENT',
        isTeacher: user?.role === 'TEACHER',
        isAdmin: user?.role === 'ADMIN',
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
