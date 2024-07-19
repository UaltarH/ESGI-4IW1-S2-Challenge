export interface CartItemResponse {
    id: string;
    quantity: number;
    CartId: string;
    ProductId: string;
    Product: {
        id: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        size?: string;
    }
}