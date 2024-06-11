export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;
}