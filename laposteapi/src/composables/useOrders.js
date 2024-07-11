const baseUrl = "http://node:3000";
// const baseUrl = process.env.BACK_API_URL;

const useOrders = () => {
    const getAllOrders = async () => {
        try {
            const response = await fetch(`${baseUrl}/orders`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    };
    
    const updateTrackingStatus = async (trackingNumber, status) => {
        try {
            const response = await fetch(`${baseUrl}/orders/updateShippingStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trackingNumber: trackingNumber,
                    status: status
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error('Error updating tracking status:', error);
            return null;
        }
    };

    return { getAllOrders, updateTrackingStatus };
};

module.exports = { useOrders };
