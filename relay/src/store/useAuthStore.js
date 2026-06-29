import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function getUsers() { return JSON.parse(localStorage.getItem('relay-users') || '[]'); }
function saveUsers(users) { localStorage.setItem('relay-users', JSON.stringify(users)); }

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            authError: null,

            register: ({ name, email, password }) => {
                const users = getUsers();
                const exists = users.find(u => u.email === email);
                if (exists) {
                    set({ authError: 'This email is already registered' });
                    return false;
                }
                const newUser = { id: `usr_${Date.now()}`, name, email, password };
                saveUsers([...users, newUser]);
                set({
                    user: { id: newUser.id, name, email },
                    isAuthenticated: true,
                    authError: null,
                });
                return true;
            },

            login: ({ email, password }) => {
                if (email === 'demo@relay.so' && password === 'demo123') {
                    set({
                        user: { id: 'usr_demo', name: 'M. Umair', email },
                        isAuthenticated: true,
                        authError: null,
                    });
                    return true;
                }
                const users = getUsers();
                const match = users.find(u => u.email === email && u.password === password);
                if (match) {
                    set({
                        user: { id: match.id, name: match.name, email: match.email },
                        isAuthenticated: true,
                        authError: null,
                    });
                    return true;
                }
                set({ authError: 'Incorrect Email and Password' });
                return false;
            },

            updateUser: (data) => set(state => ({
                user: { ...state.user, ...data },
            })),

            clearError: () => set({ authError: null }),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                authError: null,
            }),
        }),
        { name: 'relay-auth' }
    )
);