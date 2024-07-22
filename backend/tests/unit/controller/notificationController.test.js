const NotificationController = require('../../../src/controllers/NotificationController');
const MongoNotification = require('../../../src/mongo/models/MongoNotification');

jest.mock('../../../src/mongo/models/MongoNotification');

describe('NotificationController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getNotificationForUser', () => {
        it('should return notifications for a user', async () => {
            const mockNotifications = [
                { _id: '1', userId: 'user1', message: 'Test Notification 1' },
                { _id: '2', userId: 'user1', message: 'Test Notification 2' }
            ];

            MongoNotification.find.mockResolvedValue(mockNotifications);

            const req = { params: { userId: 'user1' } };
            const res = { json: jest.fn() };

            await NotificationController.getNotificationForUser(req, res);

            expect(MongoNotification.find).toHaveBeenCalledWith({ userId: 'user1' });
            expect(res.json).toHaveBeenCalledWith({ notifications: mockNotifications });
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching notifications');
            MongoNotification.find.mockRejectedValue(error);

            const req = { params: { userId: 'user1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await NotificationController.getNotificationForUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching notifications' });
        });
    });

    describe('updateNotification', () => {
        it('should update a notification and return it', async () => {
            const mockNotification = { _id: '1', userId: 'user1', read: false, save: jest.fn() };

            MongoNotification.findById.mockResolvedValue(mockNotification);

            const req = { params: { notifId: '1' } };
            const res = { json: jest.fn() };

            await NotificationController.updateNotification(req, res);

            expect(MongoNotification.findById).toHaveBeenCalledWith('1');
            expect(mockNotification.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ notification: { ...mockNotification, read: true } });
        });

        it('should return 404 if notification not found', async () => {
            MongoNotification.findById.mockResolvedValue(null);

            const req = { params: { notifId: '999' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await NotificationController.updateNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Notification not found' });
        });

        it('should handle errors', async () => {
            const error = new Error('Error updating notification');
            MongoNotification.findById.mockRejectedValue(error);

            const req = { params: { notifId: '1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await NotificationController.updateNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error updating notification' });
        });
    });

    describe('deleteNotification', () => {
        it('should delete a notification and return success message', async () => {
            const mockNotification = { _id: '1', deleteOne: jest.fn() };

            MongoNotification.findById.mockResolvedValue(mockNotification);

            const req = { params: { notifId: '1' } };
            const res = { json: jest.fn() };

            await NotificationController.deleteNotification(req, res);

            expect(MongoNotification.findById).toHaveBeenCalledWith('1');
            expect(mockNotification.deleteOne).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: 'Notification deleted' });
        });

        it('should return 404 if notification not found', async () => {
            MongoNotification.findById.mockResolvedValue(null);

            const req = { params: { notifId: '999' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await NotificationController.deleteNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Notification not found' });
        });

        it('should handle errors', async () => {
            const error = new Error('Error deleting notification');
            MongoNotification.findById.mockRejectedValue(error);

            const req = { params: { notifId: '1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await NotificationController.deleteNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting notification' });
        });
    });
});
