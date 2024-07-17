import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useSearchBarManagement = () => {
    const getSearch = async (search :string, category: string, stock: boolean) => {
        return await fetch(baseUrl + Api.search + `/?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&stock=${encodeURIComponent(stock)}`).then(res => res.json());
    }

    return { getSearch };
}
