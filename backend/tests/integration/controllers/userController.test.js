const userController = require("../../../src/controllers/userController");
const crudService = require("../../../src/services/crudGeneric");
const User = require("../../../src/sequelize/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../../src/services/crudGeneric");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("userController", () => {
  describe("getUsers", () => {
    it("should return users data", async () => {
      const req = { query: {} };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockUsers = [{ id: 1, name: "John Doe", email: "test@test.fr", password: "Password123!" }];

      crudService.findAll.mockResolvedValue({ data: mockUsers, error: null });

      await userController.getUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    });

    it("should return 400 if there is an error", async () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.findAll.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const req = { body: { name: "John Doe" } };
      const res = { sendStatus: jest.fn() };
      const next = jest.fn();

      crudService.create.mockResolvedValue({ data: { id: 1, name: "John Doe" }, error: null });

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
      const req = { params: { id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      crudService.findByPk.mockResolvedValue({ data: { id: 1, name: "John Doe" }, error: null });

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: 1, name: "John Doe" } });
    });

    it("should return 404 if user is not found", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.findByPk.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.destroy.mockResolvedValue({ data: true, error: null });

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 404 if user is not found", async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.destroy.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteMultiplesUsers", () => {
    it("should delete multiple users", async () => {
      const req = { body: { usersId: "1,2,3" } };
      const res = { sendStatus: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.destroy
        .mockResolvedValueOnce({ data: true, error: null })
        .mockResolvedValueOnce({ data: true, error: null })
        .mockResolvedValueOnce({ data: true, error: null });

      await userController.deleteMultiplesUsers(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 500 if there is an error", async () => {
      const req = { body: { usersId: "1,2,3" } };
      const res = { sendStatus: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.destroy.mockResolvedValueOnce({ data: null, error: new Error("Error") });

      await userController.deleteMultiplesUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while deleting the users" });
    });
  });

  describe("replaceUser", () => {
    it("should replace a user", async () => {
      const req = { params: { id: 1 }, body: { name: "John Doe" } };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.destroy.mockResolvedValue({ data: true, error: null });
      crudService.create.mockResolvedValue({ data: { id: 1, name: "John Doe" }, error: null });

      await userController.replaceUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if user is not found for deletion", async () => {
      const req = { params: { id: 1 }, body: { name: "John Doe" } };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.destroy.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.replaceUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 if user cannot be created", async () => {
      const req = { params: { id: 1 }, body: { name: "John Doe" } };
      const res = { status: jest.fn().mockReturnThis() };

      crudService.destroy.mockResolvedValue({ data: true, error: null });
      crudService.create.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.replaceUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("modifyUsers", () => {
    it("should modify a user", async () => {
      const req = { params: { id: 1 }, body: { name: "John Doe" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      crudService.update.mockResolvedValue({ data: { id: 1, name: "John Doe" }, error: null });

      await userController.modifyUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({ user: { id: 1, name: "John Doe" } });
    });

    it("should return 404 if user is not found", async () => {
      const req = { params: { id: 1 }, body: { name: "John Doe" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      crudService.update.mockResolvedValue({ data: null, error: new Error("Error") });

      await userController.modifyUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("login", () => {
    it("should login a user and return a token", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), cookie: jest.fn() };

      User.findOne = jest.fn().mockResolvedValue({ id: 1, email: "test@example.com", password: "hashedpassword" });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith("auth_token", "token", expect.any(Object));
    });

    it("should return 400 if too many fields are provided", async () => {
      const req = { body: { email: "test@example.com", password: "password", extra: "extra" } };
      const res = { status: jest.fn().mockReturnThis() };

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 401 if user is not found", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis() };

      User.findOne = jest.fn().mockResolvedValue(null);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 if password is invalid", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis() };

      User.findOne = jest.fn().mockResolvedValue({ id: 1, email: "test@example.com", password: "hashedpassword" });
      bcrypt.compare.mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 500 if there is a server error", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne = jest.fn().mockRejectedValue(new Error("Server error"));

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
