const request = require('supertest');
const bcrypt = require('bcryptjs');
const {app} = require("../../../src/app");
const { User } = require("../../../src/sequelize/models/");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

describe("User Controller", () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
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

  describe("GET /users", () => {
    test("should return all users for admin", async () => {
      const { token } = await createTestUser('admin');
      const response = await request(app)
        .get("/users")
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
    });

    test("should return 403 for non-admin users", async () => {
      const { token } = await createTestUser('user');
      const response = await request(app)
        .get("/users")
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("POST /register", () => {
    test("should create a new user with valid data", async () => {
      const newUser = {
        email: "newuser@test.com",
        password: "Password123!",
        firstname: "New",
        lastname: "User",
        address: "789 New St",
        city: "New City",
        zipcode: "54321",
        country: "France",
        phone: "0123456789",
        birthdate: "2000-01-01",
        newProduct: true,
        restockProduct: false,
        priceChange: true,
      };

      const response = await request(app).post("/register").send(newUser);
      expect(response.statusCode).toBe(201);
    });

    test("should return 400 if user data is invalid", async () => {
      const invalidUser = {
        email: "invalid",
        password: "short",
      };

      const response = await request(app).post("/register").send(invalidUser);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /login", () => {
    test("should return a token for valid credentials", async () => {
      const { user } = await createTestUser();

      const response = await request(app).post("/login").send({
        email: user.email,
        password: "Password123!",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/login").send({
        email: "nonexistent@test.com",
        password: "WrongPassword123!",
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /users/:id", () => {
    test("should return a specific user for admin", async () => {
      const { user: adminUser, token: adminToken } = await createTestUser('admin');
      const { user: regularUser } = await createTestUser('user');

      const response = await request(app)
        .get(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("email", regularUser.email);
    });

    test("should return 403 for non-admin trying to access other user", async () => {
      const { user: user1, token: token1 } = await createTestUser('user');
      const { user: user2 } = await createTestUser('user');

      const response = await request(app)
        .get(`/users/${user2.id}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("PATCH /users/:id", () => {
    test("should update user with valid data for admin", async () => {
      const { user: adminUser, token: adminToken } = await createTestUser('admin');
      const { user: regularUser } = await createTestUser('user');

      const updatedData = {
        firstname: "Updated",
        lastname: "User",
        password: "Password123!"
      };

      const response = await request(app)
        .patch(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);
      expect(response.statusCode).toBe(200);
    });

    test("should update own user data for non-admin", async () => {
      const { user, token } = await createTestUser('user');

      const updatedData = {
        firstname: "Updated",
        lastname: "User",
        password: "Password123!"
      };

      const response = await request(app)
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      expect(response.statusCode).toBe(200);
    });

    test("should return 400 for invalid update data", async () => {
      const { user, token } = await createTestUser('user');

      const invalidData = {
        email: "invalid",
        password: "Password123!"
      };

      const response = await request(app)
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("DELETE /users/:id", () => {
    test("should delete own user for non-admin", async () => {
      const { user, token } = await createTestUser('user');

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
    });

    test("should return 403 for non-admin trying to delete other user", async () => {
      const { user: user1, token: token1 } = await createTestUser('user');
      const { user: user2 } = await createTestUser('user');

      const response = await request(app)
        .delete(`/users/${user2.id}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(response.statusCode).toBe(403);
    });
  });
});