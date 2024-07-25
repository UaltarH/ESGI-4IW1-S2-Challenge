const request = require('supertest');
const { app } = require("../../../src/app"); 
const { User, Order, Payment, Shipping, Order_status, Cart, Order_item } = require('../../../src/sequelize/models');
const MongoOrder = require('../../../src/mongo/models/MongoOrder');
const { createStripeSession } = require('../../../src/services/stripeSession');
const { createOrderTransac } = require('../../../src/services/createOrder');
const { sendEmailWithTemplate } = require("../../../src/services/sendMail");
const { cartQueue } = require('../../../src/config/queueBullConfig');
const { afterCreateHook: orderAfterCreateHook } = require('../../../src/sequelize/hooks/OrdersHooks');
const { afterCreateHook: orderStatusAfterCreateHook } = require('../../../src/sequelize/hooks/Order_statusHooks');
const { afterCreateHook: orderItemAfterCreateHook } = require('../../../src/sequelize/hooks/Order_itemsHooks');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../../../src/sequelize/models/");

jest.mock('../../../src/services/stripeSession');
jest.mock('../../../src/services/createOrder');
jest.mock('../../../src/services/sendMail');
jest.mock('../../../src/config/queueBullConfig');
jest.mock('../../../src/sequelize/hooks/OrdersHooks', () => ({
  afterCreateHook: jest.fn(),
}));
jest.mock('../../../src/sequelize/hooks/Order_statusHooks', () => ({
  afterCreateHook: jest.fn(),
}));
jest.mock('../../../src/sequelize/hooks/Order_itemsHooks', () => ({
  afterCreateHook: jest.fn(),
}));

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  await db.sequelize.close();
  await mongoose.disconnect();
  await cartQueue.close();
});

describe("Order Tests", () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
    await Order.destroy({ where: {}, force: true });
    await Payment.destroy({ where: {}, force: true });
    await Shipping.destroy({ where: {}, force: true });
    await Order_status.destroy({ where: {}, force: true });
    await Cart.destroy({ where: {}, force: true });
    await Order_item.destroy({ where: {}, force: true });
    await MongoOrder.deleteMany({});
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

  describe("orderController", () => {
    describe("getAllOrders", () => {
      test("should return all orders", async () => {
        const { token } = await createTestUser('admin');
        await MongoOrder.create({ orderNumber: '001' });
        await MongoOrder.create({ orderNumber: '002' });

        const response = await request(app)
          .get('/orders')
          .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("orders");
        expect(response.body.orders).toHaveLength(2);
      });
    });

    describe("getAllOrdersForUser", () => {
      test("should return orders for a specific user", async () => {
        const { user, token } = await createTestUser();
        await MongoOrder.create({ 'user.userId': user.id, orderNumber: '001' });
        await MongoOrder.create({ 'user.userId': user.id, orderNumber: '002' });

        const response = await request(app)
          .get(`/orders/user/${user.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("orders");
        expect(response.body.orders).toHaveLength(2);
        expect(response.body).toHaveProperty("totalOrders", 2);
      });
    });

    describe("createOrder", () => {
      test("should create a new order", async () => {
        const { user, token } = await createTestUser();
        const orderData = {
          orderItems: [{ id: 1, quantity: 2 }],
          userId: user.id,
          date: new Date(),
          total: 100,
          shipping: { address: '123 Test St' }
        };

        createStripeSession.mockResolvedValue({ id: 'sess_123' });
        createOrderTransac.mockResolvedValue({});

        const response = await request(app)
          .post('/orders/payment')
          .set('Authorization', `Bearer ${token}`)
          .send(orderData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("sessionId", 'sess_123');
      });
    });
  });

  describe('Order Model', () => {
    test('should create an order with valid data', async () => {
        const { user, token } = await createTestUser();

      const orderData = {
        orderNumber: 'ORD-001',
        date: new Date(),
        UserId: user.id,
      };

      const order = await Order.create(orderData);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.orderNumber).toBe('ORD-001');
      expect(order.UserId).toBe(user.id);
      expect(orderAfterCreateHook).toHaveBeenCalledWith(order, expect.anything());
    });

    test('should not create an order without required fields', async () => {
      const orderData = {
        // Missing orderNumber and date
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test('should associate order with user', async () => {
        const { user, token } = await createTestUser();

      const order = await Order.create({
        orderNumber: 'ORD-002',
        date: new Date(),
        UserId: user.id,
      });

      const orderWithUser = await Order.findByPk(order.id, {
        include: [User],
      });

      expect(orderWithUser.User).toBeDefined();
      expect(orderWithUser.User.id).toBe(user.id);
    });

    test('should associate order with order items', async () => {
      const order = await Order.create({
        orderNumber: 'ORD-003',
        date: new Date(),
      });

      const orderItem = await Order_item.create({
        quantity: 2,
        price: 10.99,
        OrderId: order.id,
      });

      const orderWithItems = await Order.findByPk(order.id, {
        include: [Order_item],
      });

      expect(orderWithItems.Order_items).toBeDefined();
      expect(orderWithItems.Order_items.length).toBe(1);
      expect(orderWithItems.Order_items[0].id).toBe(orderItem.id);
    });

    test('should associate order with order status', async () => {
      const order = await Order.create({
        orderNumber: 'ORD-004',
        date: new Date(),
      });

      const orderStatus = await Order_status.create({
        status: 'En attente',
        OrderId: order.id,
      });

      const orderWithStatus = await Order.findByPk(order.id, {
        include: [Order_status],
      });

      expect(orderWithStatus.Order_statuses).toBeDefined();
      expect(orderWithStatus.Order_statuses.length).toBe(1);
      expect(orderWithStatus.Order_statuses[0].status).toBe('En attente');
    });

    test('should associate order with payment', async () => {
      const order = await Order.create({
        orderNumber: 'ORD-005',
        date: new Date(),
      });

      const payment = await Payment.create({
        amount: 100.00,
        OrderId: order.id,
        stripeSessionId: "00000"
      });

      const orderWithPayment = await Order.findByPk(order.id, {
        include: [Payment],
      });

      expect(orderWithPayment.Payment).toBeDefined();
      expect(orderWithPayment.Payment.id).toBe(payment.id);
    });

    test('should associate order with shipping', async () => {
      const order = await Order.create({
        orderNumber: 'ORD-006',
        date: new Date(),
      });

      const shipping = await Shipping.create({
        address: '123 Test St',
        OrderId: order.id,
        city: "test",
        zipcode: "00000",
        shippingMethod: "standard",
        address: 'test address'
      });

      const orderWithShipping = await Order.findByPk(order.id, {
        include: [Shipping],
      });

      expect(orderWithShipping.Shipping).toBeDefined();
      expect(orderWithShipping.Shipping.id).toBe(shipping.id);
    });
  });
});