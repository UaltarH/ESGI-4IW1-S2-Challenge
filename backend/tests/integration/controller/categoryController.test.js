const request = require('supertest');
const { app } = require("../../../src/app");
const MongoProduct = require('../../../src/mongo/models/MongoProduct');
const { escapeRegex, normalizeString, cleanQuantity } = require('../../../src/services/cleanUtils');
const { cartQueue, userQueue } = require('../../../src/config/queueBullConfig');
const mongoose = require('mongoose');

jest.mock('../../../src/mongo/models/MongoProduct');
jest.mock('../../../src/services/cleanUtils');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
    await mongoose.disconnect();
    await cartQueue.close();
    await userQueue.close();
});

describe("SearchController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    escapeRegex.mockImplementation(x => x);
    normalizeString.mockImplementation(x => x);
    cleanQuantity.mockImplementation((x) => parseInt(x) || 0);
  });

  describe("GET /search", () => {
    test("should return products based on search criteria", async () => {
      const mockProducts = [
        { name: "Product 1", price: 10 },
        { name: "Product 2", price: 20 },
      ];
      
      MongoProduct.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockProducts)
      });
      MongoProduct.countDocuments.mockResolvedValue(2);

      const response = await request(app)
        .get("/search")
        .query({ search: "test", category: "electronics", stock: "true", skip: "0" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("products", mockProducts);
      expect(response.body).toHaveProperty("totalCount", 2);

      expect(MongoProduct.find).toHaveBeenCalledWith({
        $text: {
          $search: "test",
          $caseSensitive: false,
          $diacriticSensitive: false
        },
        categoryName: "electronics",
        stock: { $gt: 0 }
      });
    });

    test("should handle empty search parameters", async () => {
      MongoProduct.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue([])
      });
      MongoProduct.countDocuments.mockResolvedValue(0);

      const response = await request(app).get("/search");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("products", []);
      expect(response.body).toHaveProperty("totalCount", 0);

      expect(MongoProduct.find).toHaveBeenCalledWith({});
    });

    test("should handle server errors", async () => {
      MongoProduct.find.mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await request(app).get("/search");

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("error", "Database error");
    });
  });
});