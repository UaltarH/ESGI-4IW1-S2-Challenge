import { mongoProduct } from '@/dto/MongoProduct.dto';
import { Product, createProduct } from '@/dto/api/product.dto';
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
      

    const getSpecificMongoProduct = async (id: string): Promise<{ product: mongoProduct }> => {
      const response = await fetch(`${baseUrl}${Api.mongoProducts}/${id}`);
      if (!response.ok) {
        const error = new Error('Product not found');
        (error as any).response = response;
        throw error;
      }
      const data = await response.json();
      return data ;
    };

    const getLastMongoProduct = async () => {
        return await fetch(baseUrl + Api.mongoProducts + '/last').then(res => res.json());
    }

    const updateProduct = async (id: string, body: Partial<mongoProduct>):Promise<{product: Product}> => {
      try {       
        const token = localStorage.getItem('auth_token');
        if(token === null) throw new Error('Error while getting orders');
        const response = await fetch(`${baseUrl}${Api.products}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw errorJson;
            } catch (err) {
                throw errorText;
            }
        }
    
        return await response.json();
      } catch (err) {
        throw err;
      }
    }

    const deleteProduct = async (id: string) => {
        return await fetch(baseUrl + Api.products + `/${id}`, {
          method: 'DELETE',
      }).then(res => res);
    }

    const deleteMultiplesProducts = async (productsId: string) => {
      return await fetch(baseUrl + Api.products, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({productsId})
      }).then(res => res);
    }
    
    const createProduct = async (bodyRequest: createProduct): Promise<{sessionId: string}> => {
      try {
          const token = localStorage.getItem('auth_token');
          if(token === null) throw new Error('Error while getting orders');
          const response = await fetch(baseUrl + Api.products, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(bodyRequest)
          });

          if (!response.ok) {
              const errorText = await response.text();
              try {
                  const errorJson = JSON.parse(errorText);
                  throw errorJson;
              } catch (err) {
                  throw errorText;
              }
          }
      
          return await response.json();
      } catch (err) {
          throw err;
      }
  }

    return { getProductById, getAllMongoProducts, getSpecificMongoProduct, getLastMongoProduct, updateProduct, deleteProduct, deleteMultiplesProducts, createProduct };
}