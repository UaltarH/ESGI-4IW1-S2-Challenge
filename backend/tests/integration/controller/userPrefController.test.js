const request = require('supertest');
const { app } = require("../../../src/app"); 
const { User, User_pref } = require("../../../src/sequelize/models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe("UserPrefController", () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
    await User_pref.destroy({ where: {}, force: true });
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

  const createUserPref = async (userId) => {
    return await User_pref.create({
      UserId: userId,
      newProduct: true,
      restockProduct: false,
      priceChange: true
    });
  };

  describe("GET /userPref/:userId", () => {
    test("should return user preferences", async () => {
      const { user, token } = await createTestUser();
      await createUserPref(user.id);

      const response = await request(app)
        .get(`/userPref/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("userPref");
      expect(response.body.userPref).toHaveProperty("newProduct", true);
      expect(response.body.userPref).toHaveProperty("restockProduct", false);
      expect(response.body.userPref).toHaveProperty("priceChange", true);
    });

    test("should return 404 if user preferences not found", async () => {
      const { user, token } = await createTestUser();

      const response = await request(app)
        .get(`/userPref/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", "User preferences not found");
    });
  });

  describe("PUT /userPref/:userId", () => {
    test("should update user preferences", async () => {
      const { user, token } = await createTestUser();
      await createUserPref(user.id);

      const updateData = {
        newProduct: false,
        priceChange: false
      };

      const response = await request(app)
        .put(`/userPref/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("userPref");
      expect(response.body.userPref).toHaveProperty("newProduct", false);
      expect(response.body.userPref).toHaveProperty("restockProduct", false);
      expect(response.body.userPref).toHaveProperty("priceChange", false);
    });

    test("should return 404 if user preferences not found for update", async () => {
      const { user, token } = await createTestUser();

      const updateData = {
        newProduct: false
      };

      const response = await request(app)
        .put(`/userPref/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", "User preferences not found");
    });

    test("should ignore non-updatable fields", async () => {
      const { user, token } = await createTestUser();
      await createUserPref(user.id);

      const updateData = {
        newProduct: false,
        invalidField: "should be ignored"
      };

      const response = await request(app)
        .put(`/userPref/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("userPref");
      expect(response.body.userPref).toHaveProperty("newProduct", false);
      expect(response.body.userPref).not.toHaveProperty("invalidField");
    });
  });
});