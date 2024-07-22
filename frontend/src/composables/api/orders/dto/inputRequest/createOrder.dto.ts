import { orderItem } from '@/dto/orderItem.dto';
import { shipping } from '@/dto/shipping.dto';
export interface createOrder {
    userId: string;
    date: Date;
    total: number;
    orderItems: orderItem[];
    shipping: shipping;
}