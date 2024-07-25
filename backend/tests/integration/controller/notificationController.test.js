const request = require('supertest');
const { app } = require("../../../src/app"); 
const MongoNotification = require('../../../src/mongo/models/MongoNotification');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User } = require("../../../src/sequelize/models/"); 
const bcrypt = require('bcryptjs');
const { cartQueue, userQueue } = require('../../../src/config/queueBullConfig');
const db = require("../../../src/sequelize/models/");

jest.mock('../../../src/mongo/models/MongoNotification');

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
    await db.sequelize.close();
    await mongoose.disconnect();
    await cartQueue.close();
    await userQueue.close();
});

describe("NotificationController", () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
    jest.clearAllMocks();
  });

  const createTestUser = async (role = 'user') => {
    const user = await User.create({
      email: `${role}@test.com`,
      password: await bcrypt.hash('Password123!', 10),
      firstname: "Test",
      lastname: "User",
      address: "123 Test St",
      city: "Test City",
      zipcode: "12345",
      country: "France",
      phone: "0123456789",
      birthdate: "1990-01-01",
      role: role,
      is_verified: true
    });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    return { user, token };
  };

  describe("GET /notif/:userId", () => {
    test("should return notifications for a user", async () => {
      const { user, token } = await createTestUser();
      const mockNotifications = [
        { _id: '1', userId: user.id, message: 'Test notification 1' },
        { _id: '2', userId: user.id, message: 'Test notification 2' }
      ];

      MongoNotification.find.mockResolvedValue(mockNotifications);

      const response = await request(app)
        .get(`/notif/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("notifications");
      expect(response.body.notifications).toHaveLength(2);
      expect(MongoNotification.find).toHaveBeenCalledWith({ userId: user.id.toString() });
    });

    test("should handle server errors", async () => {
      const { user, token } = await createTestUser();
      MongoNotification.find.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(`/notif/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
    });
  });

  describe("PUT /notif/:notifId", () => {
    test("should update a notification to read", async () => {
      const { token } = await createTestUser();
      const mockNotification = { 
        _id: 'notif123',
        read: false,
        save: jest.fn()
      };

      MongoNotification.findById.mockResolvedValue(mockNotification);

      const response = await request(app)
        .put('/notif/notif123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("notification");
      expect(response.body.notification.read).toBe(true);
      expect(mockNotification.save).toHaveBeenCalled();
    });

    test("should return 404 if notification is not found", async () => {
      const { token } = await createTestUser();
      MongoNotification.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/notif/notif123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /notif/:notifId", () => {
    test("should delete a notification", async () => {
      const { token } = await createTestUser();
      const mockNotification = { 
        _id: 'notif123',
        deleteOne: jest.fn()
      };

      MongoNotification.findById.mockResolvedValue(mockNotification);

      const response = await request(app)
        .delete('/notif/notif123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Notification deleted");
      expect(mockNotification.deleteOne).toHaveBeenCalled();
    });

    test("should return 404 if notification is not found", async () => {
      const { token } = await createTestUser();
      MongoNotification.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/notif/notif123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });
});