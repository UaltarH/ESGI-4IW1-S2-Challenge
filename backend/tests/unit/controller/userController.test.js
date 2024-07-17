const userController = require("../../../src/controllers/userController");
const crudService = require("../../../src/services/crudGeneric");
const { User } = require("../../../src/sequelize/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../../src/services/crudGeneric");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../src/sequelize/models/", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe("userController", () => {
  const mockUUID = "123e4567-e89b-12d3-a456-426614174000";
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return users data", async () => {
      const req = { query: {} };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockUsers = [{ id: mockUUID, name: "John Doe", email: "test@test.fr" }];

      crudService.findAll.mockResolvedValue({ data: mockUsers, error: null });

      await userController.getUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    });

    it("should return 400 if there is an error", async () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.findAll.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const req = { body: { name: "John Doe", email: "john@example.com", password: "password123" } };
      const res = { sendStatus: jest.fn() };
      const next = jest.fn();

      crudService.create.mockResolvedValue({ data: { id: mockUUID, ...req.body }, error: null });

      await userController.register(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    it("should call next with error if there is an error", async () => {
      const req = { body: { name: "John Doe" } };
      const res = { sendStatus: jest.fn() };
      const next = jest.fn();

      crudService.create.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("Error"));
    });
  });

  describe("getUser", () => {
    it("should return user data", async () => {
      const req = { params: { id: mockUUID }, query: {} };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      crudService.findByPk.mockResolvedValue({ data: { id: mockUUID, name: "John Doe" }, error: null });

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: mockUUID, name: "John Doe" } });
    });

    it("should return 404 if user is not found", async () => {
      const req = { params: { id: mockUUID }, query: {} };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.findByPk.mockResolvedValue({ data: null, error: new Error("User not found") });

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return specific fields if requested", async () => {
      const req = { params: { id: mockUUID }, query: { fields: "name,email" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      User.findOne = jest.fn().mockResolvedValue({ id: mockUUID, name: "John Doe", email: "john@example.com" });

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: mockUUID, name: "John Doe", email: "john@example.com" } });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const req = { params: { id: mockUUID } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.destroy.mockResolvedValue({ data: true, error: null });

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ user: true });
    });

    it("should return 404 if user is not found", async () => {
      const req = { params: { id: mockUUID } };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.destroy.mockResolvedValue({ data: null, error: new Error("User not found") });

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteMultiplesUsers", () => {
    it("should delete multiple users", async () => {
      const req = { body: { usersId: `${mockUUID},${mockUUID}` } };
      const res = { sendStatus: jest.fn() };

      crudService.destroy.mockResolvedValue({ data: true, error: null });

      await userController.deleteMultiplesUsers(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 500 if there is an error", async () => {
      const req = { body: { usersId: `${mockUUID},${mockUUID}` } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.destroy.mockRejectedValue(new Error("Deletion error"));

      await userController.deleteMultiplesUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while deleting the users" });
    });
  });

  describe("replaceUser", () => {
    it("should replace a user", async () => {
      const req = { params: { id: mockUUID }, body: { name: "John Doe" } };
      const res = { sendStatus: jest.fn() };

      crudService.destroy.mockResolvedValue({ data: true, error: null });
      crudService.create.mockResolvedValue({ data: { id: mockUUID, name: "John Doe" }, error: null });

      await userController.replaceUser(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 404 if user is not found for deletion", async () => {
      const req = { params: { id: mockUUID }, body: { name: "John Doe" } };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.destroy.mockResolvedValue({ data: null, error: new Error("User not found") });

      await userController.replaceUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 if user cannot be created", async () => {
      const req = { params: { id: mockUUID }, body: { name: "John Doe" } };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.destroy.mockResolvedValue({ data: true, error: null });
      crudService.create.mockResolvedValue({ data: null, error: new Error("Creation error") });

      await userController.replaceUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("modifyUsers", () => {
    it("should modify a user", async () => {
      const req = { params: { id: mockUUID }, body: { name: "John Doe" } };
      const res = { sendStatus: jest.fn() };

      crudService.update.mockResolvedValue({ data: { id: mockUUID, name: "John Doe" }, error: null });

      await userController.modifyUsers(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 404 if user is not found", async () => {
      const req = { params: { id: mockUUID }, body: { name: "John Doe" } };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.update.mockResolvedValue({ data: null, error: new Error("User not found") });

      await userController.modifyUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("login", () => {
    it("should login a user and return a token", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { sendStatus: jest.fn(), cookie: jest.fn() };

      User.findOne.mockResolvedValue({ id: mockUUID, email: "test@example.com", password: "hashedpassword", role: "user" });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await userController.login(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith("auth_token", "token", expect.any(Object));
    });

    it("should return 400 if too many fields are provided", async () => {
      const req = { body: { email: "test@example.com", password: "password", extra: "extra" } };
      const res = { sendStatus: jest.fn() };

      await userController.login(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(400);
    });

    it("should return 401 if user is not found", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { sendStatus: jest.fn() };

      User.findOne.mockResolvedValue(null);

      await userController.login(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it("should return 401 if password is invalid", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { sendStatus: jest.fn() };

      User.findOne.mockResolvedValue({ id: mockUUID, email: "test@example.com", password: "hashedpassword" });
      bcrypt.compare.mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it("should return 500 if there is a server error", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { sendStatus: jest.fn() };

      User.findOne.mockRejectedValue(new Error("Server error"));

      await userController.login(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});