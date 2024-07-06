export interface mongoArticle {
    _id: string,
    postgresId: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: string,
    categoryName: string,
    deleteAt: Date,
    __v: number
}