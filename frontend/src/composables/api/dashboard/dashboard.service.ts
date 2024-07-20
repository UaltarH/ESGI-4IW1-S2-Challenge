import { Api } from '../routesApi';
import { CreateWidgetInput } from './dto/inputRequest/createWidgetInput';
import { Widget } from '../../../pages/admin/dashboard/models/widget.dto';

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const DashboardService = () => {
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

    const createWidget = async (bodyRequest: CreateWidgetInput): Promise<{ widget: Widget }> => {
        try {
            const token = getToken();
            const response = await fetch(baseUrl + Api.dashboard, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyRequest),
            });

            return handleResponse(response);
        } catch (error) {
            console.error('Error creating widget:', error);
            throw error;
        }
    };

    const getWidgets = async (): Promise<{ widgets: Widget[] }> => {
        try {
            const token = getToken();
            const response = await fetch(baseUrl + Api.dashboard, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching widgets:', error);
            throw error;
        }
    };

    const deleteWidget = async (widgetId: string): Promise<void> => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}${Api.dashboard}/${widgetId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting widget:', error);
            throw error;
        }
    };

    return { createWidget, getWidgets, deleteWidget };
}