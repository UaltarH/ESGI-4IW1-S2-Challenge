import { mongoOrder } from '@/dto/MongoOrder.dto';
import {Api} from '../routesApi';
import { createOrder } from './dto/inputRequest/createOrder.dto';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const OrdersService = () => {
    const getAllMongoOrders = async (): Promise<{orders: mongoOrder[]}> => {
        return await fetch(baseUrl + Api.orders).then(res => res.json());
    }

    const getHtmlPdfOrder = async (id: string): Promise<any> => {
        return await fetch(baseUrl + Api.orders + `/${id}`).then(res => res.text());
    }

    const createOrder = async (bodyRequest: createOrder): Promise<{sessionId: string}> => {
        return await fetch(baseUrl + Api.order + '/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyRequest)
        }).then(res => res.json());
    }

    return { getAllMongoOrders, getHtmlPdfOrder, createOrder };
};