const productController = require('../../../src/controllers/productController');
const crudService = require('../../../src/services/crudGeneric');
const { Product } = require('../../../src/sequelize/models');
const MongoProduct = require('../../../src/mongo/models/MongoProduct');

jest.mock('../../../src/services/crudGeneric');
jest.mock('../../../src/mongo/models/MongoProduct');

describe('productController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product and return 201 status', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      crudService.create.mockResolvedValue({ data: mockProduct, error: null });

      const req = { body: { name: 'Test Product' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await productController.createProduct(req, res, next);

      expect(crudService.create).toHaveBeenCalledWith(Product, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, product: mockProduct });
    });

    it('should call next with error if creation fails', async () => {
      const error = new Error('Creation failed');
      crudService.create.mockResolvedValue({ data: null, error });

      const req = { body: { name: 'Test Product' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await productController.createProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getProduct', () => {
    it('should return a product if found', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      crudService.findByPk.mockResolvedValue({ data: mockProduct, error: null });

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await productController.getProduct(req, res);

      expect(crudService.findByPk).toHaveBeenCalledWith(Product, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ product: mockProduct });
    });

    it('should return 404 if product not found', async () => {
      crudService.findByPk.mockResolvedValue({ data: null, error: new Error('Not found') });

      const req = { params: { id: 999 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await productController.getProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return 204 status', async () => {
      crudService.destroy.mockResolvedValue({ data: true, error: null });

      const req = { params: { id: 1 } };
      const res = {
        sendStatus: jest.fn()
      };

      await productController.deleteProduct(req, res);

      expect(crudService.destroy).toHaveBeenCalledWith(Product, 1);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 if product not found for deletion', async () => {
      crudService.destroy.mockResolvedValue({ data: null, error: new Error('Not found') });

      const req = { params: { id: 999 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('deleteMultiplesProducts', () => {
    it('should delete multiple products and return 204 status', async () => {
      crudService.destroy.mockResolvedValue({ data: true, error: null });

      const req = { body: { productsId: '1,2,3' } };
      const res = {
        sendStatus: jest.fn()
      };

      await productController.deleteMultiplesProducts(req, res);

      expect(crudService.destroy).toHaveBeenCalledTimes(3);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 500 if any deletion fails', async () => {
      crudService.destroy.mockRejectedValueOnce(new Error('Deletion failed'));

      const req = { body: { productsId: '1,2,3' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await productController.deleteMultiplesProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while deleting the products' });
    });
  });

  describe('getMongoProducts', () => {
    it('should return mongo products with filters', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      MongoProduct.find.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue(mockProducts)
        })
      });
      MongoProduct.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({ price: 100 })
      });
      MongoProduct.countDocuments.mockResolvedValue(1);

      const req = {
        query: {
          limit: '10',
          skip: '0',
          maxPrice: '50',
          categories: 'cat1,cat2'
        }
      };
      const res = {
        json: jest.fn()
      };

      await productController.getMongoProducts(req, res);

      expect(res.json).toHaveBeenCalledWith({
        products: mockProducts,
        totalCount: 1,
        maxPrice: 100,
        minPrice: 100
      });
    });
  });

  describe('getSpecificMongoProduct', () => {
    it('should return a specific mongo product if found', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      MongoProduct.findById.mockResolvedValue(mockProduct);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn()
      };

      await productController.getSpecificMongoProduct(req, res);

      expect(res.json).toHaveBeenCalledWith({ product: mockProduct });
    });

    it('should return 404 if mongo product not found', async () => {
      MongoProduct.findById.mockResolvedValue(null);

      const req = { params: { id: '999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await productController.getSpecificMongoProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('getLast5MongoProduct', () => {
    it('should return last 5 mongo products', async () => {
      const mockProducts = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
      MongoProduct.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockProducts)
        })
      });

      const req = {};
      const res = {
        json: jest.fn()
      };

      await productController.getLast5MongoProduct(req, res);

      expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return it', async () => {
      const mockUpdatedProduct = { id: 1, name: 'Updated Product' };
      crudService.update.mockResolvedValue({ data: mockUpdatedProduct, error: null });

      const req = { 
        params: { id: 1 },
        body: { name: 'Updated Product', categoryId: 2 }
      };
      const res = {
        json: jest.fn()
      };

      await productController.updateProduct(req, res);

      expect(crudService.update).toHaveBeenCalledWith(Product, 1, { name: 'Updated Product', CategoryId: 2 });
      expect(res.json).toHaveBeenCalledWith({ product: mockUpdatedProduct });
    });

    it('should return 404 if product not found for update', async () => {
      crudService.update.mockResolvedValue({ data: null, error: new Error('Not found') });

      const req = { 
        params: { id: 999 },
        body: { name: 'Updated Product' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found in postgres' });
    });
  });
});