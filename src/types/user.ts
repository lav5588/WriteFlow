export interface IUser {
    username: string;
    bio: string;
    email: string;
    isVerified: boolean;
    name: string;
    profileImage?: string;
    role: 'ADMIN' | 'USER';
    _id: string;
}

export interface ISessionUser {
    email: string;
    isVerified: boolean;
    name: string;
    profileImage:string;
    role: 'ADMIN' | 'USER';
    username: string;
    _id: string;
}