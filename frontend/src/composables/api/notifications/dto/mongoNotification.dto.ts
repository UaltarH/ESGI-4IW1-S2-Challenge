export interface MongoNotification {
    _id: string;
    userId: string;
    roleUser: string;
    typeNotification: string;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}