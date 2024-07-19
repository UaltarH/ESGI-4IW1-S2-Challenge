import { Api } from "./routesApi";
import {CartItem} from "@/dto/cart.dto.ts";
const baseUrl = import.meta.env.VITE_APP_API_URL;

export const useCart = () => {
    const getCart = async (id: string) => {
        const token = localStorage.getItem('auth_token');
        if (token === null) {
            throw new Error('Error while getting cart');
        }
        return await fetch(baseUrl + Api.cart + `/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        } ).then(res => res);
    }
    const getCartByUserId = async (id: string) => {
        const token = localStorage.getItem('auth_token');
        if (token === null) {
            throw new Error('Error while getting cart');
        }
        return await fetch(baseUrl + Api.cart + `?UserId=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }).then(res => res);
    }
    const createCart = async (id: string, UserId: string, products: CartItem[]) => {
        const token = localStorage.getItem('auth_token');
        if (token === null) {
            throw new Error('Error while creating cart');
        }
        return await fetch(baseUrl + Api.cart, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ UserId, id, products }),
        }).then(res => res);
    }
    return { getCart, getCartByUserId, createCart }
}