const { useOrders } = require('../composables/useOrders');

class LaPosteAPIController {
    static async index(req, res) {
        const trackingNumber = req.params.trackingNumber;
        
        const { getAllOrders } = useOrders();
        try {
            const orders = await getAllOrders(); 
            console.log(orders);
            res.json(orders); 
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: "Failed to retrieve orders" }); 
        }
    }

    static async create(req, res) {
        try {
            const trackingNumber = trackingNumberCreation[Math.floor(Math.random() * 3)]
            res.json(trackingNumber);
        } catch (error) {
            res.status(500).json({ error: "Failed to create tracking number" }); 
        }
    }

    static async update(req, res) {
        try {
            const trackingNumber = req.body.trackingNumber
            const status = req.body.status
            const { updateTrackingStatus } = useOrders();

            if (isCorrect(status)) {
                const response = await updateTrackingStatus(trackingNumber, status)
    
                if (response && response.ok) {
                    return res.json("ok");
                } else {
                    return res.status(500).json({ error: "Failed to update status" });
                }
            } else {
                return res.status(400).json({ error: "Invalid status" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to update status" }); 
        }
    }
}

const isCorrect = (status) => {
    return shippingStatus.includes(status);
}

const shippingStatus = ["En attente d'expédition", 'En livraison', 'En attente', 'Problème de livraison']

const trackingNumberCreation = [40333870114531, 14804899007121, 39138761900988]


module.exports = { LaPosteAPIController };
