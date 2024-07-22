const baseUrl = "http://node:3000";
// const baseUrl = process.env.BACK_API_URL;

const useOrders = () => {
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
            console.log('response updateShippingStatus: ', response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error('Error updating tracking status:', error);
            return null;
        }
    };

    return { updateTrackingStatus };
};

module.exports = { useOrders };
