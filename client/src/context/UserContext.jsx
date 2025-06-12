import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // You should use credentials 'include' if your server uses cookies for sessions
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                }
            } catch (error) {
                console.error("Could not fetch user profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, loading }}>
            {children}
        </UserContext.Provider>
    );
}
