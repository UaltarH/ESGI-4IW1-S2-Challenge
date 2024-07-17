import {Api} from './routesApi';

const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useUserManagement = () => {
    const getUsers = async (handler:Function) => {
        return await fetch(baseUrl + Api.user).then(res => handler(res.json()));
    }

    const getUser = async (id: number, handler:Function) => {
        return await fetch(baseUrl + Api.user + id).then(res => handler(res.json()));
    }

    const updateUser = async (id: string, handler:Function, bodyValues: any) => {
        return await fetch(baseUrl + Api.user + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(bodyValues)
        }).then(res => handler(res.json()));
    }

    const deleteUser = async (id: string) => {
        return await fetch(baseUrl + Api.user + id, {
            method: 'DELETE',
            credentials: 'include'
        }).then(res => res);
    }

    const deleteMultiplesUsers = async (usersId: string) => {
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

    return {getUsers, getUser, deleteUser, getRoles, updateUser, deleteMultiplesUsers};
}