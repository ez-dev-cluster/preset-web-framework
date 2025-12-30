import type {$Fetch, FetchOptions} from "ofetch";
import { ofetch } from "ofetch";
import {th} from "vuetify/locale";
import {AuthRepository} from "~/repositories/AuthRepository";
import {tryCatch} from "~/utils/tryCatch";

const BASE_URL = "http://localhost:8000";

export default class BaseRepository {
    fetcher: $Fetch;

    constructor() {
        const store = useAuthStore();
        this.fetcher = ofetch.create({
            onRequest: async (context) => {
                context.options.headers.set(
                    "Authorization",
                    "Bearer " + store.access_token,
                )
                context.options.retry = 2;
                context.options.retryDelay = 100;
                context.options.retryStatusCodes = [401];
            },
            onResponse: async (context) => {
                const response = context.response;
                if (response.status === 401) {
                    const auth_repository = new AuthRepository();

                    const [refresh_response,error] = await auth_repository.refreshToken(
                        store.refresh_token
                    );

                    if (error) {
                        store.logout()
                        window.location.href = "/login";
                    }
                    store.access_token = refresh_response.access;

                }
            }
        });
    }

    async sfetch(method: string, path: string, options: FetchOptions={}) {
        return tryCatch(this.fetcher(BASE_URL + path, {
            method: method,
            ...options,
        }))
    }

    async ofetch(method: string, path: string, options: FetchOptions={}) {
        return tryCatch(ofetch(BASE_URL + path, {
            method: method,
            ...options,
        }))
    }
}