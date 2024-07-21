import { Api } from "./routesApi";
import {CartItem} from "@/dto/cart.dto.ts";
const baseUrl = import.meta.env.VITE_APP_API_URL;

export const useCart = () => {
    const getCartByUserId = async (id: string) => {
        const token = localStorage.getItem('auth_token');
        if (token === null) {
            throw new Error('Error while getting cart');
        }
        return await fetch(baseUrl + Api.cartByUser + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }).then(res => res);
    }
    const createCartNoUser = async (products: CartItem[]) => {
        return await fetch(baseUrl + Api.cart, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({  products }),
        }).then(res => res);
    }
    const createCart = async (products: CartItem[], UserId: string) => {
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
            body: JSON.stringify({ UserId, products }),
        }).then(res => res);
    }
    const updateCartWithProduct = async (id: string, products: CartItem[]) => {
        const token = localStorage.getItem('auth_token');
        let headers: {[key:string]: string} = {
            "Content-Type": "application/json",
        }
        if (token !== null) {
            headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        }
        return await fetch(baseUrl + Api.cart, {
            method: "PUT",
            headers,
            body: JSON.stringify({ id, products }),
        }).then(res => res);
    }
    const updateCartUser = async (id: string, UserId:string) => {
        const token = localStorage.getItem('auth_token');
        if (token === null) {
            throw new Error('Error while updating cart');
        }
        return await fetch(baseUrl + Api.cart, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ UserId, id }),
        }).then(res => res);
    }
    const deleteCart = async (id: string) => {
        const token = localStorage.getItem('auth_token');
        let headers: {[key:string]: string} = {
            "Content-Type": "application/json",
        }
        if (token !== null) {
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }
        return await fetch(baseUrl + Api.cart + `/${id}`, {
            method: "DELETE",
            headers,
        }).then(res => res);
    }
    return {  getCartByUserId, createCart,createCartNoUser, updateCartUser, updateCartWithProduct, deleteCart };
}