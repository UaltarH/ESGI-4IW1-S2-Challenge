import {Api} from './api';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useSearchBarManagement = () => {
    const getSearch = async (search :string) => {
        return await fetch(baseUrl + Api.search + `/${search}`).then(res => res.json());
    }

    const getProductById = async (id :number) => {
        return await fetch(baseUrl + Api.getProductById + `/${id}`).then(res => res.json())
    }

    return {getSearch, getProductById};
}