const SearchController = require('../../../src/controllers/SearchController');
const MongoProduct = require('../../../src/mongo/models/MongoProduct');
const { escapeRegex, normalizeString, cleanQuantity } = require('../../../src/services/cleanUtils');

jest.mock('../../../src/mongo/models/MongoProduct');
jest.mock('../../../src/services/cleanUtils');

describe('SearchController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return products and total count', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
      const mockCount = 2;

      MongoProduct.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockProducts)
      });
      MongoProduct.countDocuments.mockResolvedValue(mockCount);

      await SearchController.getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith({ products: mockProducts, totalCount: mockCount });
    });

    it('should handle search term', async () => {
      req.query.search = 'test';
      escapeRegex.mockReturnValue('test');
      normalizeString.mockReturnValue('test');

      await SearchController.getProducts(req, res);

      expect(MongoProduct.find).toHaveBeenCalledWith(expect.objectContaining({
        $text: {
          $search: 'test',
          $caseSensitive: false,
          $diacriticSensitive: false
        }
      }));
    });

    it('should handle category filter', async () => {
      req.query.category = 'Electronics';

      await SearchController.getProducts(req, res);

      expect(MongoProduct.find).toHaveBeenCalledWith(expect.objectContaining({
        categoryName: 'Electronics'
      }));
    });

    it('should handle stock filter', async () => {
      req.query.stock = 'true';

      await SearchController.getProducts(req, res);

      expect(MongoProduct.find).toHaveBeenCalledWith(expect.objectContaining({
        stock: { $gt: 0 }
      }));
    });

    it('should handle pagination', async () => {
      req.query.skip = '10';
      cleanQuantity.mockReturnValue(10);

      await SearchController.getProducts(req, res);

      expect(MongoProduct.find().skip).toHaveBeenCalledWith(10);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      MongoProduct.find.mockRejectedValue(error);

      await SearchController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Test error' });
    });
  });
});
