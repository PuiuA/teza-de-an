import API from '../config/api.js';

const getToken = () => sessionStorage.getItem('accessToken');
const getRefresh = () => sessionStorage.getItem('refreshToken');

export const authService = {

    async login(username, password) {
        const res = await fetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) throw new Error('Credențiale incorecte');
        const data = await res.json();
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('username', data.username);
        return data;
    },

    logout() {
        sessionStorage.clear();
        window.location.href = '/admin/login';
    },

    me() {
        const token = getToken();
        const role = sessionStorage.getItem('role');
        const username = sessionStorage.getItem('username');
        if (!token) return Promise.resolve(null);
        return Promise.resolve({ role, username });
    },

    async fetchWithAuth(url, options = {}) {
        let token = getToken();
        if (!token) {
            window.location.href = '/admin/login';
            return null;
        }

        let res = await fetch(`${API}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                'Authorization': `Bearer ${token}`, // ← dupa options.headers
            },
        });

        // Token expirat — încearcă refresh
        if (res.status === 401) {
            const refreshToken = getRefresh();
            if (!refreshToken) {
                window.location.href = '/admin/login';
                return null;
            }

            const refreshRes = await fetch(`${API}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!refreshRes.ok) {
                sessionStorage.clear();
                window.location.href = '/admin/login';
                return null;
            }

            const refreshData = await refreshRes.json();
            sessionStorage.setItem('accessToken', refreshData.accessToken);
            token = refreshData.accessToken;

            // Reface requestul cu noul token
            res = await fetch(`${API}${url}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                    'Authorization': `Bearer ${token}`, // ← dupa options.headers
                },
            });
        }

        return res;
    },
};