const CategoryController = require('../../../src/controllers/categoryController');
const { Category } = require('../../../src/sequelize/models');

jest.mock('../../../src/sequelize/models', () => ({
  Category: {
    findAll: jest.fn()
  }
}));

describe('CategoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return all categories when successful', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
      ];
      Category.findAll.mockResolvedValue(mockCategories);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await CategoryController.getAllCategories(req, res);

      expect(Category.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ categories: mockCategories });
    });

    it('should return 500 status with error message when there is an error', async () => {
      const errorMessage = 'Database error';
      Category.findAll.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await CategoryController.getAllCategories(req, res);

      expect(Category.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});