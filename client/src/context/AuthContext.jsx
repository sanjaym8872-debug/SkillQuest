import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        setLoading(true);
        try {
            console.log('Checking auth status...');
            const res = await axios.get(`${API_URL}/auth/me`, { timeout: 5000 });
            console.log('Auth check success:', res.data ? 'User found' : 'No user');
            setUser(res.data);
        } catch (err) {
            console.error('Auth check failed:', err.message);
            setUser(null);
        } finally {
            console.log('Auth check complete.');
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (identity, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { identity, password });
        await checkUser();
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
        await checkUser();
        return res.data;
    };

    const logout = async () => {
        await axios.post(`${API_URL}/auth/logout`);
        setUser(null);
    };

    const updateCharacter = async (characterClass) => {
        const res = await axios.post(`${API_URL}/user/character`, { characterClass });
        setUser(res.data);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateCharacter, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
