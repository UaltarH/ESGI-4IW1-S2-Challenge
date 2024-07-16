const mongoose = require('mongoose');
const connectMongoDB = require('../../src/config/mongo_config');


jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectMongoDB', () => {
  it('should connect to MongoDB', async () => {
    const mockMangooseConnect = mongoose.connect.mockResolvedValueOnce();
    const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    await connectMongoDB();
    expect(mockMangooseConnect).toHaveBeenCalledWith(process.env.MONGO_URL);
    expect(mockLog).toHaveBeenCalledWith('Connected to MongoDB');
  });

  it('should handle connection error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    mongoose.connect.mockRejectedValueOnce(new Error('Connection error'));

    await connectMongoDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to connect to MongoDB', expect.any(Error));
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
