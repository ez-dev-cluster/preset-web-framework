import BaseRepository from "~/repositories/BaseRepository";
import {FetchError} from "ofetch";

export class AuthRepository extends BaseRepository {
    async loginWithCredentials(username: string, password: string) {
        const body={
            username: username,
            password: password,
        };
        return this.ofetch('POST','/api/token/',{body});
    }

    async refreshToken(refresh_token: string) {
        const body={
            refresh: refresh_token
        };
        return this.ofetch('POST','/api/token/refresh/',{body});
    }

    async fetchUser(): Promise<Result<any, FetchError>>{
        return this.sfetch('GET','/api/user/me/');
    }
}