export interface CartItem {
    id: string;
    postgresId: string;
    name: string;
    description: string;
    size: string;
    price: number;
    quantity: number;
}