const request = require('supertest');
const { app } = require("../../../src/app");
const { User } = require("../../../src/sequelize/models/");
const ChartDataService = require('../../../src/services/dashboardService');
const MongoDashboardConfig = require('../../../src/mongo/models/MongoDashboardConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../../../src/services/dashboardService');
jest.mock('../../../src/mongo/models/MongoDashboardConfig');


describe("DashboardController", () => {
    beforeEach(async () => {
        await User.destroy({ where: {}, force: true });
        jest.clearAllMocks();
    }, 10000);
  
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

  describe("GET /dashboard", () => {
    test("should return all widgets with chart data", async () => {
        const { token } = await createTestUser('admin');
      const mockWidgets = [
        { _id: '1', title: 'Widget 1', dataSource: 'source1', indexData: 'index1', categoriesData: ['category1'] },
        { _id: '2', title: 'Widget 2', dataSource: 'source2', indexData: 'index2', categoriesData: ['category2'] },
      ];

      const mockChartData = { data: [{ x: 1, y: 2 }] };

      MongoDashboardConfig.find.mockResolvedValue(mockWidgets);
      ChartDataService.getChartData.mockResolvedValue(mockChartData);

      const response = await request(app).get("/dashboard")
      .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("widgets");
      expect(response.body.widgets).toHaveLength(2);
      expect(response.body.widgets[0]).toHaveProperty("data", mockChartData.data);
      expect(MongoDashboardConfig.find).toHaveBeenCalledTimes(1);
      expect(ChartDataService.getChartData).toHaveBeenCalledTimes(2);
    });

    test("should handle server errors", async () => {
        const { token } = await createTestUser('admin');
      MongoDashboardConfig.find.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/dashboard")
      .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
    });
  });

  describe("POST /dashboard", () => {
    test("should create a new widget", async () => {
        const { token } = await createTestUser('admin');
      const newWidget = {
        title: "New Widget",
        description: "Description",
        chartType: "bar",
        dataSource: "source",
        indexField: "index",
        categoryField1: "category",
        w: 2,
        h: 2,
        x: 0,
        y: 0
      };

      const mockCreatedWidget = { _id: '3', ...newWidget };
      const mockChartData = { data: [{ x: 1, y: 2 }] };

      MongoDashboardConfig.create.mockResolvedValue(mockCreatedWidget);
      ChartDataService.getChartData.mockResolvedValue(mockChartData);

      const response = await request(app)
        .post("/dashboard")
        .set('Authorization', `Bearer ${token}`)
        .send(newWidget);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("widget");
      expect(response.body.widget).toHaveProperty("id", '3');
      expect(response.body.widget).toHaveProperty("data", mockChartData.data);
      expect(MongoDashboardConfig.create).toHaveBeenCalledTimes(1);
      expect(ChartDataService.getChartData).toHaveBeenCalledTimes(1);
    });
  });

  describe("DELETE /dashboard/:widgetId", () => {
    test("should delete a widget", async () => {
        const { token } = await createTestUser('admin');
      const widgetId = '1';

      MongoDashboardConfig.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const response = await request(app).delete(`/dashboard/${widgetId}`)
      .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(MongoDashboardConfig.deleteOne).toHaveBeenCalledWith({ _id: widgetId });
    });

    test("should handle server errors during widget deletion", async () => {
      MongoDashboardConfig.deleteOne.mockRejectedValue(new Error("Database error"));

      const { token } = await createTestUser('admin');
      const response = await request(app).delete("/dashboard/1")
      .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
    });
  });

  describe("PUT /dashboard", () => {
    test("should update widgets", async () => {
        const { token } = await createTestUser('admin');
      const updates = [
        { idWidget: '1', grid: { w: 2, h: 2, x: 0, y: 0 } },
        { idWidget: '2', grid: { w: 3, h: 2, x: 2, y: 0 } },
      ];

      MongoDashboardConfig.findByIdAndUpdate.mockResolvedValue({});

      const response = await request(app)
        .put("/dashboard")
        .set('Authorization', `Bearer ${token}`)
        .send({ widgets: updates });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Widgets updated successfully");
      expect(MongoDashboardConfig.findByIdAndUpdate).toHaveBeenCalledTimes(2);
    });
  });
});