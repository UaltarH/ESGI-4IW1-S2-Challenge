import {Api} from "@/composables/api/routesApi.ts";
import { createUser, User } from '@/dto/user.dto';

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const UserService = () => {
    const getUserById = async (id :string, handler: Function, options?: {fields: string[]}) => {
        let params = '';
        if(options) {
            params = `?fields=${options.fields.toString()}`;
        }
        const token  = localStorage.getItem('auth_token');
        if( token === null) {
            return handler(401);
        }
        return await fetch(baseUrl + Api.user + `/${id}` + params, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }).then(res => handler(res)).catch(() => {
            handler(500);
        });
    }
    const updateUser = async (id: string, data: any, handler: Function) => {
        const token = localStorage.getItem('auth_token');
        if (token === null) {
            handler(new Response(null, { status: 401 }));
        }
        await fetch(baseUrl + Api.user + `/${id}`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }).then(res => handler(res));
    }    
    const getUsers = async (handler:Function) => {
        const token = localStorage.getItem('auth_token');
        if( token === null) {
            return handler(401);
        }
        return await fetch(baseUrl + Api.user, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        }).then(res => handler(res));
    }

    const deleteUser = async (id: string) => {
        const token = localStorage.getItem('auth_token');
        if(token === null) throw new Error('Error while deleting user');
        const response = await fetch(baseUrl + `${Api.user}` + `/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error deleting user');
        }
        return response;
    }

    const deleteBatchUsers = async (users: User[]) => {
        const token = localStorage.getItem('auth_token');
        if(token === null) throw new Error('Error while deleting users');
        const nonAdminUsers = users.filter(user => user.role !== 'admin');
        const nonAdminIds = nonAdminUsers.map(user => user.id);
        
        if (nonAdminIds.length === 0) {
            throw new Error('Impossible de supprimer un administrateur');
        }
    
        const response = await fetch(`${baseUrl}/${Api.user}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ usersId: nonAdminIds.join(',') })
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Une erreur est survenue');
        }
    
        return response;
    }

    const createUser = async (bodyRequest: any): Promise<{sessionId: string}> => {
        try {
            const token = localStorage.getItem('auth_token');
            if(token === null) throw new Error('Error while getting orders');
            const response = await fetch(baseUrl + Api.user, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyRequest)
            });            
        
            return await response.json();
        } catch (err) {
            throw err;
        }
    }
    return { getUserById, getUsers, updateUser, deleteUser, deleteBatchUsers, createUser }
}