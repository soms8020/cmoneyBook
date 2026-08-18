import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await api.auth.getMe();
            if (res.success) {
                setUser(res.data);
            }
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        const handleAuthError = () => {
            setUser(null);
            localStorage.removeItem('token');
        };
        window.addEventListener('auth_error', handleAuthError);
        return () => window.removeEventListener('auth_error', handleAuthError);
    }, []);

    const login = async (email, password) => {
        const res = await api.auth.login({ email, password });
        if (res.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return true;
        }
        return false;
    };

    const register = async (name, email, password) => {
        const res = await api.auth.register({ name, email, password });
        if (res.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
