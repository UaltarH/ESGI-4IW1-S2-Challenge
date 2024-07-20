import {Api} from "@/composables/api/routesApi.ts";

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
        return await fetch(baseUrl + Api.user + `${id}` + params, {
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
            return handler(401);
        }
    
        try {
            const response = await fetch(baseUrl + Api.user + `${id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
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
    
            return handler(response);
        } catch (error) {
            throw error;
        }
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
        return await fetch(baseUrl + Api.user + id, {
            method: 'DELETE',
        }).then(res => res);
    }

    const deleteBatchUsers = async (usersId: string) => {
        return await fetch(baseUrl + Api.user, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({usersId})
        }).then(res => res);
    }

    const getRoles = async (handler:Function) => {
        return await fetch(baseUrl + Api.getRoles).then(res => handler(res.json()));
    }
    return { getUserById, getUsers, updateUser, deleteUser, getRoles, deleteBatchUsers }
}