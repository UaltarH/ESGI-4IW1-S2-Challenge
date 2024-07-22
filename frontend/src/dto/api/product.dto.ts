export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imagePath: string;
    threshold: number;
    CategoryId: string;
    createdAt: string;
    updatedAt: string;
} 

export interface createProduct {
    name: string;
    description: string;
    price: number;
    stock: number;
    imagePath: string;
    threshold: number;
    CategoryId: string;
} 