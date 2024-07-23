import { mongoOrder } from '@/dto/MongoOrder.dto';
import {Api} from '../routesApi';
import { createOrder } from './dto/inputRequest/createOrder.dto';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const OrdersService = () => {
    const token = localStorage.getItem('auth_token');
    if(token === null) throw new Error('Error while getting orders');
    
    const getAllMongoOrders = async (): Promise<{orders: mongoOrder[]}> => {
        return await fetch(baseUrl + Api.orders,{
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }
        }).then(res => res.json());
    }

    const getHtmlPdfOrder = async (id: string): Promise<string> => {
        try {
            const token = localStorage.getItem('auth_token');
            if(token === null) throw new Error('Error while getting orders');

            const response = await fetch(`${baseUrl}${Api.orders}/${id}`,{
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            throw error;
        }
    }    

    const createOrder = async (bodyRequest: createOrder): Promise<{sessionId: string}> => {
        return await fetch(baseUrl + Api.orders + '/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyRequest)
        }).then(res => res.json());
    }

    const handleAfterRequestOrder = async (sessionId: string, status: string): Promise<{message: string}> => {
        const url = new URL(baseUrl + Api.orders + '/payment/' + sessionId);
        url.searchParams.append('status', status);

        return await fetch(url.toString(), {
            method: 'GET',
        }).then(res => res.json());
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

    return { getAllMongoOrders, getHtmlPdfOrder, createOrder, handleAfterRequestOrder, getSpecificMongoOrder };
};