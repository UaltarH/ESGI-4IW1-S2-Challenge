import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useSearchBarManagement = () => {
    const getSearch = async (search :string) => {
        return await fetch(baseUrl + Api.search + `/${search}`).then(res => res.json());
    }

    return { getSearch };
}