const { useOrders } = require('../composables/useOrders');

class LaPosteAPIController {
    static async create(req, res) {
        try {
            const trackingNumber = Math.floor(Math.random() * 1e9);
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

const shippingStatus = ["Expédiée", 'Livrée']


module.exports = { LaPosteAPIController };
