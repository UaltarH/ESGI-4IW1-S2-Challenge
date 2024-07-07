export interface mongoProduct {
    _id: string,
    postgresId: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: string,
    categoryName: string,
    createdAt: Date,
    updatedAt: Date,
    deleteAt: Date,
    __v: number
}