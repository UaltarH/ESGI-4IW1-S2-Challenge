export interface User {
    address: string,
    birthdate: Date,
    city: string,
    country: string,
    createdAt?: Date,
    email: string,
    firstname: string,
    id: string,
    lastname: string,
    password?: string,
    phone: string,
    role?: "admin" | "user" | "store_manager" | "accountant",
    updatedAt?: Date,
    zipcode: number,
    verification_token: string,
}

export interface createUser {
    address: string,
    birthdate: Date,
    city: string,
    country: string,
    email: string,
    firstname: string,
    lastname: string,
    password?: string,
    phone: string,
    role?: "admin" | "user" | "store_manager" | "accountant",
    zipcode: number,
}