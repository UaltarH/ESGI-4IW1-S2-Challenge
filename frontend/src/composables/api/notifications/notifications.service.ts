import { Api } from '../routesApi';
import { Notification } from './dto/notification.dto';

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const NotificationService = () => {
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

    const getNotificationsForUser = async (userId: string): Promise<{ notifications: Notification[] }> => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}${Api.notification}/${userId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    };

    const updateNotification = async (notifId: string): Promise<{ notification: Notification }> => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}${Api.notification}/${notifId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return handleResponse(response);
        } catch (error) {
            console.error('Error updating notification:', error);
            throw error;
        }
    };

    const deleteNotification = async (notifId: string): Promise<{ message: string }> => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}${Api.notification}/${notifId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return handleResponse(response);
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    };

    return { getNotificationsForUser, updateNotification, deleteNotification };
}