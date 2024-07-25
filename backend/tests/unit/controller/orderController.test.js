const orderController = require('../../../src/controllers/orderController');
const MongoOrder = require('../../../src/mongo/models/MongoOrder');
const { Order, Payment, Shipping, Order_status, Cart, User } = require('../../../src/sequelize/models');
const { createStripeSession } = require('../../../src/services/stripeSession');
const { createOrderTransac } = require('../../../src/services/createOrder');
const { sendMail } = require("../../../src/services/sendMail");
const { cartQueue } = require('../../../src/config/queueBullConfig');

jest.mock('../../../src/mongo/models/MongoOrder');
jest.mock('../../../src/sequelize/models');
jest.mock('../../../src/services/stripeSession');
jest.mock('../../../src/services/createOrder');
jest.mock('../../../src/services/sendMail');
jest.mock('../../../src/config/queueBullConfig');

describe('orderController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateShippingStatus', () => {
    it('should update shipping status successfully', async () => {
      Shipping.findOne.mockResolvedValue({ OrderId: 1 });
      Order_status.create.mockResolvedValue({});

      const req = {
        body: { trackingNumber: '123', status: 'Shipped' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await orderController.updateShippingStatus(req, res);

      expect(Shipping.findOne).toHaveBeenCalledWith({ where: { trackingNumber: '123' } });
      expect(Order_status.create).toHaveBeenCalledWith({ status: 'Shipped', OrderId: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Shipping status updated" });
    });

    it('should return 404 if shipping not found', async () => {
      Shipping.findOne.mockResolvedValue(null);

      const req = {
        body: { trackingNumber: '123', status: 'Shipped' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await orderController.updateShippingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Shipping not found" });
    });
  });

  // describe('getAllOrders', () => {
  //   it('should return all orders', async () => {
  //     const mockOrders = [{ id: 1 }, { id: 2 }];
  //     MongoOrder.find.mockResolvedValue(mockOrders);

  //     const req = {};
  //     const res = {
  //       json: jest.fn()
  //     };

  //     await orderController.getAllOrders(req, res);

  //     expect(MongoOrder.find).toHaveBeenCalled();
  //     expect(res.json).toHaveBeenCalledWith({ orders: mockOrders });
  //   });
  // });

  // describe('getAllOrdersForUser', () => {
  //   it('should return paginated orders for a user', async () => {
  //     const mockOrders = [{ id: 1 }, { id: 2 }];
  //     MongoOrder.find.mockReturnValue({
  //       skip: jest.fn().mockReturnThis(),
  //       limit: jest.fn().mockResolvedValue(mockOrders)
  //     });
  //     MongoOrder.countDocuments.mockResolvedValue(10);

  //     const req = {
  //       params: { id: '123' },
  //       query: { page: '1', limit: '5' }
  //     };
  //     const res = {
  //       json: jest.fn()
  //     };

  //     await orderController.getAllOrdersForUser(req, res);

  //     expect(MongoOrder.find).toHaveBeenCalledWith({ 'user.userId': '123' });
  //     expect(res.json).toHaveBeenCalledWith({
  //       orders: mockOrders,
  //       totalOrders: 10,
  //       currentPage: 1,
  //       totalPages: 2
  //     });
  //   });
  // });

  describe('createPdfOrder', () => {
    it('should render invoice for an order', async () => {
      const mockOrder = { id: '123', items: [] };
      MongoOrder.findById.mockResolvedValue(mockOrder);

      const req = {
        params: { id: '123' }
      };
      const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await orderController.createPdfOrder(req, res);

      expect(MongoOrder.findById).toHaveBeenCalledWith('123');
      expect(res.render).toHaveBeenCalledWith('invoice', mockOrder);
    });

    it('should return 404 if order not found', async () => {
      MongoOrder.findById.mockResolvedValue(null);

      const req = {
        params: { id: '123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await orderController.createPdfOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Order not found" });
    });
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const mockSession = { id: 'sess_123' };
      createStripeSession.mockResolvedValue(mockSession);
      createOrderTransac.mockResolvedValue({});

      const req = {
        body: {
          orderItems: [],
          userId: '123',
          date: '2023-07-22',
          total: 100,
          shipping: {}
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await orderController.createOrder(req, res);

      expect(createStripeSession).toHaveBeenCalled();
      expect(createOrderTransac).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ sessionId: 'sess_123' });
    });
  });
});
