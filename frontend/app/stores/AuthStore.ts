import {defineStore} from "pinia";
import {AuthRepository} from "~/repositories/AuthRepository";
import {err} from "~/utils/tryCatch";
import type {LoggedInUser} from "~/interfaces/user";

export const useAuthStore = defineStore("authStore", {
    state: () => {
        return {
            access_token: '',
            refresh_token: '',
            user: null as LoggedInUser|null,
        };
    },
    actions: {
        async login(username: string, password: string) {
            const auth_repository = new AuthRepository();
            const [response, login_error] = await auth_repository.loginWithCredentials(username, password);
            if (login_error) {
                return err(login_error);
            }
            this.access_token = response.access;
            this.refresh_token = response.refresh;
            localStorage.setItem("access_token", response.access);
            localStorage.setItem("refresh_token", response.refresh);

            const [user,user_error] = await auth_repository.fetchUser();
            if (user_error){
                return err(user_error);
            }
            this.user = user;
            return ok(user);
        },
        logout(){
            this.access_token = '';
            this.refresh_token = '';
            this.user = null;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        },
        async initAuth(){
            const access_token = localStorage.getItem("access_token");
            const refresh_token = localStorage.getItem("refresh_token");
            if (access_token&& refresh_token){
                this.access_token = access_token;
                this.refresh_token = refresh_token;

                const auth_repository = new AuthRepository();
                const [user,user_error] = await auth_repository.fetchUser();
                if (user_error){
                    return err(user_error);
                }
                this.user = user;
            }

        }
    },
})