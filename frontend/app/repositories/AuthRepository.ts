import BaseRepository from "~/repositories/BaseRepository";

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

    async fetchUser(){
        return this.sfetch('GET','/api/user/me/');
    }
}