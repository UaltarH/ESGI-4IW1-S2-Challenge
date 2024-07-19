import { Api } from "./routesApi";
const baseUrl = import.meta.env.VITE_APP_API_URL;

export const useCart = () => {
    const getCart = async (id: string) => {
        return await fetch(baseUrl + Api.basket + id).then(res => res);
    }
    return { getCart }
}