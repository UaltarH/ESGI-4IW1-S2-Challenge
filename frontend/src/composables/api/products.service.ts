import { mongoProduct } from '@/dto/MongoProduct.dto';
import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const ProductService = () => {
    const getProductById = async (id :number) => {
        return await fetch(baseUrl + Api.products + `/${id}`).then(res => res.json())
    }

    const getAllMongoProducts = async (
        options: {
          categories?: string[];
          maxPrice?: number;
          page?: number;
          limit?: number;
        } = {}
      ): Promise<{
        products: mongoProduct[];
        totalCount: number;
        maxPrice: number;
        minPrice: number;
      }> => {
        const { categories, maxPrice, page, limit } = options;
        const params = new URLSearchParams();
      
        if (categories && categories.length > 0) {
          params.append('categories', categories.join(','));
        }
        if (maxPrice !== undefined) {
          params.append('maxPrice', maxPrice.toString());
        }
        if (limit !== undefined) {
          params.append('limit', limit.toString());
        }
        if (page !== undefined) {
          params.append('skip', ((page - 1) * (limit || 0)).toString());
        }
      
        const url = `${baseUrl}${Api.mongoProducts}${params.toString() ? `?${params.toString()}` : ''}`;
        return await fetch(url).then(res => res.json());
      };
      

    const getSpecificMongoProduct = async (id: string):Promise<{product: mongoProduct}> => 
    {
        return await fetch(baseUrl + Api.mongoProducts + `/${id}`).then(res => res.json());
    }

    const getLastMongoProduct = async () => {
        return await fetch(baseUrl + Api.mongoProducts + '/last').then(res => res.json());
    }

    return { getProductById, getAllMongoProducts, getSpecificMongoProduct, getLastMongoProduct};
}