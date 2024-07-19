import { mongoOrder } from '@/dto/MongoOrder.dto';
import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const OrdersService = () => {
    const getAllMongoOrders = async (): Promise<{orders: mongoOrder[]}> => {
        return await fetch(baseUrl + Api.orders).then(res => res.json());
    }

    const getSpecificMongoOrder = async (id: string, page: number = 1, limit: number = 10): Promise<{orders: mongoOrder[], totalOrders: number, currentPage: number, totalPages: number}> => {
        const token = localStorage.getItem('auth_token');
        if(token === null) throw new Error('Error while getting orders');
        return await fetch(`${baseUrl}${Api.orders}/user/${id}?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }).then(res => res.json());
    }

    const getHtmlPdfOrder = async (id: string): Promise<any> => {
        return await fetch(baseUrl + Api.orders + `/${id}`).then(res => res.text());
    }

    return { getAllMongoOrders, getHtmlPdfOrder, getSpecificMongoOrder };
};