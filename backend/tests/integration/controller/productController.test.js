const request = require('supertest');
const { app } = require("../../../src/app");
const { Product, Category, User } = require("../../../src/sequelize/models/");
const MongoProduct = require("../../../src/mongo/models/MongoProduct");
const { createNotification } = require('../../../src/services/notificationService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


jest.mock("../../../src/mongo/models/MongoProduct");
jest.mock("../../../src/services/notificationService");

describe("Product Controller", () => {
  beforeEach(async () => {
    await Product.destroy({ where: {}, force: true });
    await Category.destroy({ where: {}, force: true });
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

  const createTestCategory = async () => {
    return await Category.create({
      name: "Test Category"
    });
  };

  const createTestProduct = async (categoryId) => {
    return await Product.create({
      name: "Test Product",
      description: "This is a test product",
      price: 99.99,
      stock: 10,
      CategoryId: categoryId,
      threshold: 5,
      imagePath: '/test/png',
    });
  };

  describe("POST /products", () => {
    test("should create a new product with valid data and trigger after-create hook", async () => {
      const { token } = await createTestUser('admin');
      const category = await createTestCategory();
      const newProduct = {
        name: "New Product",
        description: "This is a new product",
        price: 49.99,
        stock: 5,
        CategoryId: category.id,
        threshold: 2,
        imagePath: '/test/png',
      };

      MongoProduct.create.mockResolvedValue({});
      createNotification.mockResolvedValue({});

      const response = await request(app).post("/products")
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("product");

      expect(MongoProduct.create).toHaveBeenCalled();
      expect(createNotification).toHaveBeenCalledWith('user', 'newProduct', expect.anything(), expect.any(Function));
    });
  });

  describe("put /products/:id", () => {
    test("should update a product and trigger after-update hook", async () => {
      const { token } = await createTestUser('admin');
      const category = await createTestCategory();
      const product = await createTestProduct(category.id);
      const updatedData = {
        name: "Updated Product",
        price: 79.99,
        stock: 1
      };

      MongoProduct.findOne.mockResolvedValue({ stock: 0, price: 99.99 });
      MongoProduct.findOneAndUpdate.mockResolvedValue({});
      createNotification.mockResolvedValue({});

      const response = await request(app)
        .put(`/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("product");
      expect(response.body.product).toHaveProperty("name", "Updated Product");

      expect(MongoProduct.findOneAndUpdate).toHaveBeenCalled();
      expect(createNotification).toHaveBeenCalledWith('user', 'restockProduct', expect.anything(), expect.any(Function));
      expect(createNotification).toHaveBeenCalledWith('user', 'priceChange', expect.anything(), expect.any(Function));
      expect(createNotification).toHaveBeenCalledWith('admin', 'lowStock', expect.anything(), expect.any(Function));
    });
  });

  describe("DELETE /products/:id", () => {
    test("should delete a product and trigger after-destroy hook", async () => {
      const category = await createTestCategory();
      const product = await createTestProduct(category.id);

      MongoProduct.findOneAndDelete.mockResolvedValue({});

      const response = await request(app).delete(`/products/${product.id}`);
      expect(response.statusCode).toBe(204);

      expect(MongoProduct.findOneAndDelete).toHaveBeenCalledWith({ postgresId: product.id });
    });
  });
});