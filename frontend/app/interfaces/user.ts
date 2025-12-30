export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface LoggedInUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
    picture: string;
    permissions: string[];
    is_superuser: boolean;
}

export interface LoginResult {
    access: string;
    refresh: string;
}