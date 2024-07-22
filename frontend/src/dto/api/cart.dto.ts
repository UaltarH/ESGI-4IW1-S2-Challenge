import { CartItemResponse } from "./cartItem.dto";
export interface CartResponse {
    id: string;
    UserId: string;
    Cart_items: CartItemResponse[];
}