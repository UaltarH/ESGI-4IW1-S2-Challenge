import { connectPostgres } from "../config/db";
import { Sequelize } from "sequelize";
import { jest } from "@jest/globals";

jest.mock("sequelize", () => {
  const SequelizeMock = jest.fn(() => ({
    authenticate: jest.fn(),
  }));
  SequelizeMock.prototype.authenticate = jest.fn();
  return { Sequelize: SequelizeMock };
});

test("Connection réussie à postgres", async () => {
  const sequelize = new Sequelize();
  sequelize.authenticate.mockResolvedValueOnce();

  const result = await connectPostgres();

  expect(result).toBe(true);
  expect(sequelize.authenticate).toHaveBeenCalledTimes(1);
});

test("Connection échouée à postgres", async () => {
  const sequelize = new Sequelize();
  sequelize.authenticate.mockRejectedValueOnce(new Error("Connection error"));

  const result = await connectPostgres();

  expect(result).toBe(false);
  expect(sequelize.authenticate).toHaveBeenCalledTimes(1);
});

// C'est de la merde ce test je l'améilore plus tard, c'est du GPT actuellement