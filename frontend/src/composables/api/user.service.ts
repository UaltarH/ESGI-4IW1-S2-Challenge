import {Api} from "@/composables/api/routesApi.ts";

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const UserService = () => {
    const getUserById = async (id :string, handler: Function, options?: {fields: string[]}) => {
        let params = '';
        if(options) {
            params = `?fields=${options.fields.toString()}`;
        }
        return await fetch(baseUrl + Api.user + `${id}` + params)
            .then(res => handler(res));
    }
    const updateUser = async (id :string, data: any, handler: Function) => {
        return await fetch(baseUrl + Api.user + `${id}`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(res => handler(res));
    }
    return { getUserById, updateUser }
}