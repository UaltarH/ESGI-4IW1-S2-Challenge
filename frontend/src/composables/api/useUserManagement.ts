import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useUserManagement = () => {
    const getUsers = async (handler:Function) => {
        return await fetch(baseUrl + Api.user).then(res => handler(res.json()));
    }

    const getUser = async (id: number, handler:Function) => {
        return await fetch(baseUrl + Api.user + id).then(res => handler(res.json()));
    }

    const updateUser = async (id: number, handler:Function, bodyValues: any) => {
        console.log(bodyValues);
        
        return await fetch(baseUrl + Api.user + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(bodyValues)
        }).then(res => handler(res.json()));
    }

    const deleteUser = async (id: number) => {
        return await fetch(baseUrl + Api.deleteUser + `/${id}`, {
            method: 'DELETE',
        }).then(res => res.json());
    }

    const getRoles = async (handler:Function) => {
        return await fetch(baseUrl + Api.getRoles).then(res => handler(res.json()));
    }

    return {getUsers, getUser, deleteUser, getRoles, updateUser};
}