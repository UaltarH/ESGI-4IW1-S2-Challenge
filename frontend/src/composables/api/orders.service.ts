import { mongoOrder } from '@/dto/MongoOrder.dto';
import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const OrdersService = () => {
    const getAllMongoOrders = async (): Promise<{orders: mongoOrder[]}> => {
        return await fetch(baseUrl + Api.orders).then(res => res.json());
    }

    const getHtmlPdfOrder = async (id: string): Promise<any> => {
        return await fetch(baseUrl + Api.orders + `/${id}`).then(res => res.text());
    }

    const postPaymentIntent = async (): Promise<{sessionId: string}> => {
        return await fetch(baseUrl + Api.order + '/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(order)
        }).then(res => res.json());
    }

    return { getAllMongoOrders, getHtmlPdfOrder, postPaymentIntent };
};