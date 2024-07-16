import { Category } from '@/dto/category.dto';
import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const CategoriesService = () => {
    const getCategories = async (): Promise<{ categories: Category[] }> => {
        try {
            const response = await fetch(baseUrl + Api.category);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                categories: data.categories
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    };
    
    

    return {getCategories};
}