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
        }).then(res => handler(res));
    }
    const updateUser = async (id :string, data: any, handler: Function) => {
        const token  = localStorage.getItem('auth_token');
        if( token === null) {
            return handler(401);
        }
        return await fetch(baseUrl + Api.user + `${id}`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }).then(res => handler(res));
    }
    return { getUserById, updateUser }
}