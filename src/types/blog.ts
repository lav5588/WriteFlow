import { IUser } from "./user";

export interface IBlog {
    _id: string;
    title: string;
    content: string;
    slug: string;
    isPublished: boolean;
    author: IUser;
}