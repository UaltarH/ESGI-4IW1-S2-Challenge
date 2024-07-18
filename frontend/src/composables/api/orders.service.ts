import { mongoOrder } from '@/dto/MongoOrder.dto';
import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const OrdersService = () => {
    const getAllMongoOrders = async (): Promise<{orders: mongoOrder[]}> => {
        return await fetch(baseUrl + Api.orders).then(res => res.json());
    }

    const getSpecificMongoOrder = async (id: string): Promise<{orders: mongoOrder[]}> => {
        return await fetch(baseUrl + Api.ordersForUser+ `/${id}`).then(res => res.json());
    }

    const getHtmlPdfOrder = async (id: string): Promise<any> => {
        return await fetch(baseUrl + Api.orders + `/${id}`).then(res => res.text());
    }

    return { getAllMongoOrders, getHtmlPdfOrder, getSpecificMongoOrder };
};