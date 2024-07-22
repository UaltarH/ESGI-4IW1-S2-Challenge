const userController = require("../../../src/controllers/userController");
const crudService = require("../../../src/services/crudGeneric");
const { User, User_pref } = require("../../../src/sequelize/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../../src/services/sendMail");
const { userQueue } = require('../../../src/config/queueBullConfig');

jest.mock("../../../src/services/crudGeneric");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../src/services/sendMail");
jest.mock('../../../src/config/queueBullConfig');
jest.mock("../../../src/sequelize/models/", () => ({
  User: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
  },
  User_pref: {
    create: jest.fn(),
  },
}));

describe("userController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return users when successful", async () => {
      const mockUsers = [{ id: 1, name: "Test User" }];
      crudService.findAll.mockResolvedValue({ data: mockUsers, error: null });

      const req = { query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUsers(req, res);

      expect(crudService.findAll).toHaveBeenCalledWith(User, {});
      expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    });

    it("should return 400 status when there's an error", async () => {
      crudService.findAll.mockResolvedValue({ data: null, error: new Error("Test error") });

      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUsers(req, res);

      expect(crudService.findAll).toHaveBeenCalledWith(User, {});
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("register", () => {
    it("should create a new user and return 201 status when successful", async () => {
      const mockUser = { id: 1, email: "test@example.com", verification_token: "token123" };
      crudService.findOne.mockResolvedValue({ data: null, error: null });
      crudService.create.mockImplementation((model, data) => {
        if (model === User) {
          return Promise.resolve({ data: mockUser, error: null });
        } else if (model === User_pref) {
          return Promise.resolve({ data: { id: 2 }, error: null });
        }
      });
      userQueue.add.mockResolvedValue();
      sendMail.mockResolvedValue();
  
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
          newProduct: true,
          restockProduct: false,
          priceChange: true,
        },
      };
      const res = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await userController.register(req, res);
  
      expect(crudService.findOne).toHaveBeenCalledWith(User, { email: "test@example.com" });
      expect(crudService.create).toHaveBeenCalledWith(User, expect.objectContaining({
        email: "test@example.com",
        password: "password123",
      }));
      expect(crudService.create).toHaveBeenCalledWith(User_pref, {
        UserId: 1,
        newProduct: true,
        restockProduct: false,
        priceChange: true,
      });
      expect(userQueue.add).toHaveBeenCalled();
      expect(sendMail).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(201);
    });
  });

  describe("getUser", () => {
    it("should return user when found", async () => {
      const mockUser = { id: 1, name: "Test User" };
      crudService.findByPk.mockResolvedValue({ data: mockUser, error: null });

      const req = { params: { id: 1 }, query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUser(req, res);

      expect(crudService.findByPk).toHaveBeenCalledWith(User, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should return 404 when user not found", async () => {
      crudService.findByPk.mockResolvedValue({ data: null, error: new Error("Not found") });

      const req = { params: { id: 999 }, query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUser(req, res);

      expect(crudService.findByPk).toHaveBeenCalledWith(User, 999);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteUser", () => {
    it("should delete user and return 204 status", async () => {
      User.findByPk.mockResolvedValue({ id: 1, role: 'user' });
      crudService.destroy.mockResolvedValue({ data: true, error: null });

      const req = { params: { id: 1 } };
      const res = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.deleteUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(crudService.destroy).toHaveBeenCalledWith(User, 1);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 403 when trying to delete an admin", async () => {
      User.findByPk.mockResolvedValue({ id: 1, role: 'admin' });

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
      };

      await userController.deleteUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("deleteMultiplesUsers", () => {
    it("should delete multiple users and return 204 status", async () => {
      User.findAll.mockResolvedValue([
        { id: 1, role: 'user' },
        { id: 2, role: 'user' },
      ]);
      crudService.destroy.mockResolvedValue({ data: true, error: null });

      const req = { body: { usersId: "1,2" } };
      const res = {
        sendStatus: jest.fn(),
      };

      await userController.deleteMultiplesUsers(req, res);

      expect(User.findAll).toHaveBeenCalled();
      expect(crudService.destroy).toHaveBeenCalledTimes(2);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe("replaceUser", () => {
    it("should replace user and return 200 status", async () => {
      crudService.destroy.mockResolvedValue({ data: true, error: null });
      crudService.create.mockResolvedValue({ data: { id: 1 }, error: null });

      const req = { params: { id: 1 }, body: { name: "New Name" } };
      const res = {
        sendStatus: jest.fn(),
      };

      await userController.replaceUser(req, res);

      expect(crudService.destroy).toHaveBeenCalledWith(User, 1);
      expect(crudService.create).toHaveBeenCalledWith(User, { name: "New Name" });
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe("modifyUsers", () => {
    it("should modify user and return 204 status", async () => {
      crudService.update.mockResolvedValue({ data: true, error: null });

      const req = { params: { id: 1 }, body: { name: "Updated Name" } };
      const res = {
        sendStatus: jest.fn(),
      };

      await userController.modifyUsers(req, res);

      expect(crudService.update).toHaveBeenCalledWith(User, 1, { name: "Updated Name" });
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe("login", () => {
    it("should return a token when login is successful", async () => {
      const mockUser = { id: 1, email: "test@example.com", password: "hashedPassword", is_verified: true, role: 'user' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "fakeToken" });
    });

    it("should return 401 status when user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const req = {
        body: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      };
      const res = {
        sendStatus: jest.fn(),
      };

      await userController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "nonexistent@example.com" } });
      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });
  });

  describe("verify", () => {
    it("should verify user and return 200 status", async () => {
      const mockUser = { id: 1, is_verified: false, verification_token: "token123", save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);
      userQueue.getJobs.mockResolvedValue([{ data: { userId: 1 }, remove: jest.fn() }]);

      const req = { params: { token: "token123" } };
      const res = {
        sendStatus: jest.fn(),
      };

      await userController.verify(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { verification_token: "token123" } });
      expect(mockUser.save).toHaveBeenCalled();
      expect(userQueue.getJobs).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 404 when verification token is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const req = { params: { token: "invalidToken" } };
      const res = {
        sendStatus: jest.fn(),
      };

      await userController.verify(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { verification_token: "invalidToken" } });
      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
  });
});