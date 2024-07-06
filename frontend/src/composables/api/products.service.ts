import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const ProductService = () => {
    const getProductById = async (id :number) => {
        return await fetch(baseUrl + Api.products + `/${id}`).then(res => res.json())
    }

    const getAllMongoProducts = async () => {
        return await fetch(baseUrl + Api.mongoProducts).then(res => res.json());
    }

    const getSpecificMongoProduct = async (id: number) => {
        return await fetch(baseUrl + Api.mongoProducts + `/${id}`).then(res => res.json());
    }

    return { getProductById, getAllMongoProducts, getSpecificMongoProduct};
}