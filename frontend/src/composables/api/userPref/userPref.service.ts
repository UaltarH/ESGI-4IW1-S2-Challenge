import { Api } from '../routesApi';
import { UpdateUserPref } from './dto/inputRequest/updateUserPref.dto';
import { UserPref } from './dto/userPref.dto';

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const UserPrefService = () => {
    const getToken = (): string => {
        const token = localStorage.getItem('auth_token');
        if (token === null) {
            throw new Error('Token not found');
        }
        return token;
    };

    const handleResponse = async (response: Response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const getUserPref = async (userId: string): Promise<{ userPref: UserPref }> => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}${Api.userPref}/${userId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching user preferences:', error);
            throw error;
        }
    };

    const updateUserPref = async (userId: string, bodyRequest: UpdateUserPref): Promise<{ userPref: UserPref }> => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}${Api.userPref}/${userId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyRequest),
            });

            return handleResponse(response);
        } catch (error) {
            console.error('Error updating user preferences:', error);
            throw error;
        }
    };

    return { getUserPref, updateUserPref };
}