import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useSearchBarManagement = () => {
    const getSearch = async (
        options: {
            search?: string;
            category?: string;
            stock?: string;
            page?: number;
            limit?: number;
        } = {}
    ) => {
        const { search, category, stock, page, limit } = options;
        const params = new URLSearchParams();

        if (search) {
            params.append('search', search);
        }
        if (category) {
            params.append('category', category);
        }
        if (stock) {
            params.append('stock', stock);
        }
        if (limit !== undefined) {
            params.append('limit', limit.toString());
        }
        if (page !== undefined) {
            params.append('skip', ((page - 1) * (limit || 0)).toString());
        }
        const url = `${baseUrl}${Api.search}${params.toString() ? `?${params.toString()}` : ''}`;
        return await fetch(url).then(res => res.json());
    }

    return { getSearch };
}
