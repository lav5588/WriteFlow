export interface IUser {
    username: string;
    bio:string;
    email:string;
    isVerified:boolean;
    name:string;
    profileImage?: string;
    role: 'ADMIN' | 'USER';
    _id: string;
}