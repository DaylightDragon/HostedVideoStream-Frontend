import { defineStore } from 'pinia';
import type { AuthData } from "../interfaces/AuthTypes.ts";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authData: null as null | AuthData,
    }),
    actions: {
        initializeStore() {
            // Восстанавливаем состояние из localStorage
            const savedState = localStorage.getItem('authStore');
            if (savedState) {
                this.$state = JSON.parse(savedState);
            }
        },
        saveStore() {
            localStorage.setItem('authStore', JSON.stringify(this.$state));
        },
        set_token(credentials: { token: string }) {
                this.authData = {"token": credentials.token};

                this.saveStore();
        },
        logout() {
            this.authData = null;

            localStorage.removeItem('authStore');
        },
    },
    getters: {
        isUserAuthenticated: (state) => state.authData !== null,
    },
});
