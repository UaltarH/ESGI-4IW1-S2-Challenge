const { createOrderTransac } = require('../../../src/services/createOrder');

const { Order, Order_item, Payment, Shipping, sequelize, Order_status } = require('../../../src/sequelize/models');

// Mock des modèles Sequelize
jest.mock('../../../src/sequelize/models', () => ({
  Order: {
    create: jest.fn(),
  },
  Order_item: {
    create: jest.fn(),
  },
  Payment: {
    create: jest.fn(),
  },
  Shipping: {
    create: jest.fn(),
  },
  Order_status: {
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

describe('createOrderTransac', () => {
  let mockTransaction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    sequelize.transaction.mockResolvedValue(mockTransaction);
  });

  it('devrait créer une commande avec succès', async () => {
    const userId = 1;
    const date = new Date();
    const orderItemsInput = [
      { productId: 1, quantity: 2, price: 10 },
      { productId: 2, quantity: 1, price: 15 },
    ];
    const total = 35;
    const stripeSessionId = 'stripe_session_123';
    const shipping = {
      shippingMethod: 'Standard',
      address: '123 Rue Test',
      city: 'Ville Test',
      zipcode: '12345',
      country: 'Pays Test',
    };

    Order.create.mockResolvedValue({ id: 1 });

    await createOrderTransac(userId, date, orderItemsInput, total, stripeSessionId, shipping);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({ UserId: userId, date }),
      expect.objectContaining({ transaction: mockTransaction })
    );
    expect(Order_item.create).toHaveBeenCalledTimes(2);
    expect(Payment.create).toHaveBeenCalledWith(
      expect.objectContaining({ OrderId: 1, stripeSessionId, amount: total }),
      expect.objectContaining({ transaction: mockTransaction })
    );
    expect(Shipping.create).toHaveBeenCalledWith(
      expect.objectContaining({ OrderId: 1, ...shipping, trackingNumber: null }),
      expect.objectContaining({ transaction: mockTransaction })
    );
    expect(Order_status.create).toHaveBeenCalledWith(
      expect.objectContaining({ OrderId: 1, status: "En attente" }),
      expect.objectContaining({ transaction: mockTransaction })
    );
    expect(mockTransaction.commit).toHaveBeenCalled();
    expect(mockTransaction.rollback).not.toHaveBeenCalled();
  });

  it('devrait effectuer un rollback en cas d\'erreur', async () => {
    const userId = 1;
    const date = new Date();
    const orderItemsInput = [{ productId: 1, quantity: 1, price: 10 }];
    const total = 10;
    const stripeSessionId = 'stripe_session_456';
    const shipping = {
      shippingMethod: 'Express',
      address: '456 Rue Test',
      city: 'Ville Test',
      zipcode: '67890',
      country: 'Pays Test',
    };

    Order.create.mockRejectedValue(new Error('Erreur test'));

    await createOrderTransac(userId, date, orderItemsInput, total, stripeSessionId, shipping);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(Order.create).toHaveBeenCalled();
    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(mockTransaction.commit).not.toHaveBeenCalled();
  });
});