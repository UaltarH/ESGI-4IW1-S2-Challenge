export interface mongoProduct {
    _id: string,
    postgresId: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    imagePath: string,
    threshold: number,
    categoryId: string,
    categoryName: string,
    createdAt: Date,
    updatedAt: Date,    
    __v: number
}