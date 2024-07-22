const { User_pref } = require('../../../src/sequelize/models');
const UserPrefController = require('../../../src/controllers/userPrefController.js');

jest.mock('../../../src/sequelize/models', () => ({
    User_pref: {
        findOne: jest.fn(),
    },
}));

describe('UserPrefController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserPref', () => {
        it('should return user preferences if found', async () => {
            const mockUserPref = { UserId: 1, newProduct: true, restockProduct: false, priceChange: true };
            User_pref.findOne.mockResolvedValue(mockUserPref);

            const req = { params: { userId: 1 } };
            const res = { json: jest.fn() };

            await UserPrefController.getUserPref(req, res);

            expect(User_pref.findOne).toHaveBeenCalledWith({ where: { UserId: 1 } });
            expect(res.json).toHaveBeenCalledWith({ userPref: mockUserPref });
        });

        it('should return 404 if user preferences are not found', async () => {
            User_pref.findOne.mockResolvedValue(null);

            const req = { params: { userId: 999 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserPrefController.getUserPref(req, res);

            expect(User_pref.findOne).toHaveBeenCalledWith({ where: { UserId: 999 } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User preferences not found' });
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Database error');
            User_pref.findOne.mockRejectedValue(error);

            const req = { params: { userId: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserPrefController.getUserPref(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('updateUserPref', () => {
        it('should update user preferences if found', async () => {
            const existingUserPref = { UserId: 1, newProduct: false, restockProduct: false, priceChange: false, save: jest.fn() };
            const updatedFields = { newProduct: true, priceChange: true };

            User_pref.findOne.mockResolvedValue(existingUserPref);

            const req = { params: { userId: 1 }, body: updatedFields };
            const res = { json: jest.fn() };

            await UserPrefController.updateUserPref(req, res);

            expect(User_pref.findOne).toHaveBeenCalledWith({ where: { UserId: 1 } });
            expect(existingUserPref.newProduct).toBe(true);
            expect(existingUserPref.priceChange).toBe(true);
            expect(existingUserPref.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ userPref: existingUserPref });
        });

        it('should return 404 if user preferences are not found', async () => {
            User_pref.findOne.mockResolvedValue(null);

            const req = { params: { userId: 999 }, body: { newProduct: true } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserPrefController.updateUserPref(req, res);

            expect(User_pref.findOne).toHaveBeenCalledWith({ where: { UserId: 999 } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User preferences not found' });
        });

        it('should handle errors and return 500', async () => {
            const error = new Error('Database error');
            User_pref.findOne.mockRejectedValue(error);

            const req = { params: { userId: 1 }, body: { newProduct: true } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await UserPrefController.updateUserPref(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });
});
