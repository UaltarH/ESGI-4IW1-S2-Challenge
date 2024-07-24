const request = require('supertest');
const {app} = require("../../../src/app");
const { Product } = require("../../../src/sequelize/models/");
const MongoProduct = require("../../../src/mongo/models/MongoProduct");
const db = require("../../../src/sequelize/models/");

jest.mock("../../../src/mongo/models/MongoProduct");

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Product Controller", () => {
  beforeEach(async () => {
    await Product.destroy({ where: {}, force: true });
    jest.clearAllMocks();
  });

  const createTestProduct = async () => {
    return await Product.create({
      name: "Test Product",
      description: "This is a test product",
      price: 99.99,
      stock: 10
    });
  };

  describe("POST /products", () => {
    test("should create a new product with valid data", async () => {
      const newProduct = {
        name: "New Product",
        description: "This is a new product",
        price: 49.99,
        stock: 5
      };

      const response = await request(app).post("/products").send(newProduct);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("product");
    });
  });

  describe("GET /products/:id", () => {
    test("should return a specific product", async () => {
      const product = await createTestProduct();

      const response = await request(app).get(`/products/${product.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("product");
      expect(response.body.product).toHaveProperty("id", product.id);
    });

    test("should return 404 for non-existent product", async () => {
      const response = await request(app).get("/products/999");
      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /products/:id", () => {
    test("should delete a product", async () => {
      const product = await createTestProduct();

      const response = await request(app).delete(`/products/${product.id}`);
      expect(response.statusCode).toBe(204);
    });
  });

  describe("DELETE /products", () => {
    test("should delete multiple products", async () => {
      const product1 = await createTestProduct();
      const product2 = await createTestProduct();

      const response = await request(app).delete("/products").send({
        productsId: `${product1.id},${product2.id}`
      });
      expect(response.statusCode).toBe(204);
    });
  });

  describe("PATCH /products/:id", () => {
    test("should update a product", async () => {
      const product = await createTestProduct();
      const updatedData = {
        name: "Updated Product",
        price: 79.99
      };

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(updatedData);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("product");
      expect(response.body.product).toHaveProperty("name", "Updated Product");
    });
  });

  describe("GET /mongoProducts", () => {
    test("should return mongo products", async () => {
      const mockProducts = [
        { _id: "1", name: "Product 1", price: 10 },
        { _id: "2", name: "Product 2", price: 20 }
      ];
      MongoProduct.find.mockResolvedValue(mockProducts);
      MongoProduct.findOne.mockResolvedValueOnce({ price: 20 }).mockResolvedValueOnce({ price: 10 });
      MongoProduct.countDocuments.mockResolvedValue(2);

      const response = await request(app).get("/mongoProducts");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("products");
      expect(response.body).toHaveProperty("totalCount", 2);
      expect(response.body).toHaveProperty("maxPrice", 20);
      expect(response.body).toHaveProperty("minPrice", 10);
    });
  });

  describe("GET /mongoProducts/:id", () => {
    test("should return a specific mongo product", async () => {
      const mockProduct = { _id: "1", name: "Product 1", price: 10 };
      MongoProduct.findById.mockResolvedValue(mockProduct);

      const response = await request(app).get("/mongoProducts/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("product");
      expect(response.body.product).toEqual(mockProduct);
    });

    test("should return 404 for non-existent mongo product", async () => {
      MongoProduct.findById.mockResolvedValue(null);

      const response = await request(app).get("/mongoProducts/999");
      expect(response.statusCode).toBe(404);
    });
  });

  describe("GET /mongoProducts/last5", () => {
    test("should return last 5 mongo products", async () => {
      const mockProducts = [
        { _id: "1", name: "Product 1" },
        { _id: "2", name: "Product 2" },
        { _id: "3", name: "Product 3" },
        { _id: "4", name: "Product 4" },
        { _id: "5", name: "Product 5" }
      ];
      MongoProduct.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockProducts)
      });

      const response = await request(app).get("/mongoProducts/last");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("products");
      expect(response.body.products).toHaveLength(5);
    });
  });
});