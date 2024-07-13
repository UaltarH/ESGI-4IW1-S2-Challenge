import {Api} from './api/routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useCategoryManagement = () => {
    const getCategories = async () => {
        return await fetch(baseUrl + Api.category).then(res => res.json());
    }

    return {getCategories};
}