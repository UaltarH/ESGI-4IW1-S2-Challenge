const MongoNotification = require('../mongo/models/MongoNotification');

class NotificationController {
    static async getNotificationForUser(req, res) {
        try {
            const userId = req.params.userId;
            const records = await MongoNotification.find({ userId });
            res.json({ notifications: records });
        } catch (error) {
            console.error('Erreur dans getNotificationForUser :', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async updateNotification(req, res) {
        try {
            const notifId = req.params.notifId;
            const notification = await MongoNotification.findById(notifId);
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }

            notification.read = true;
            await notification.save();
            res.json({ notification });
        } catch (error) {
            console.error('Erreur dans updateNotification :', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteNotification(req, res) {
        try {
            const notifId = req.params.notifId;
            const notification = await MongoNotification.findById(notifId);
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }

            await notification.deleteOne();
            res.json({ message: 'Notification deleted' });
        } catch (error) {
            console.error('Erreur dans deleteNotification :', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = NotificationController;