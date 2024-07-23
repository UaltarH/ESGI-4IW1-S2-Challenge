const DashboardController = require('../../../src/controllers/DashboardController');
const ChartDataService = require('../../../src/services/dashboardService');
const MongoDashboardConfig = require('../../../src/mongo/models/MongoDashboardConfig');

jest.mock('../../../src/services/dashboardService');
jest.mock('../../../src/mongo/models/MongoDashboardConfig');

describe('DashboardController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getWidgets', () => {
        it('should return widgets data', async () => {
            const mockWidgets = [
                {
                    _id: '1',
                    title: 'Test Widget',
                    description: 'Test Description',
                    chartType: 'bar',
                    dataSource: 'testSource',
                    indexData: 'testIndex',
                    categoriesData: ['testCategory'],
                    grid: { w: 2, h: 2, x: 0, y: 0 },
                }
            ];
            const mockChartData = { data: [1, 2, 3] };

            MongoDashboardConfig.find.mockResolvedValue(mockWidgets);
            ChartDataService.getChartData.mockResolvedValue(mockChartData);

            const req = {};
            const res = { json: jest.fn() };
            const next = jest.fn();

            await DashboardController.getWidgets(req, res, next);

            expect(MongoDashboardConfig.find).toHaveBeenCalled();
            expect(ChartDataService.getChartData).toHaveBeenCalledWith('testSource', 'testIndex', 'testCategory');
            expect(res.json).toHaveBeenCalledWith({
                widgets: [
                    {
                        id: '1',
                        title: 'Test Widget',
                        description: 'Test Description',
                        chartType: 'bar',
                        dataSource: 'testSource',
                        indexData: 'testIndex',
                        categoriesData: ['testCategory'],
                        data: [1, 2, 3],
                        grid: { w: 2, h: 2, x: 0, y: 0 },
                    }
                ]
            });
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching widgets');
            MongoDashboardConfig.find.mockRejectedValue(error);

            const req = {};
            const res = { sendStatus: jest.fn() };
            const next = jest.fn();

            await DashboardController.getWidgets(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('createWidget', () => {
        it('should create a new widget and return it', async () => {
            const mockWidget = {
                _id: '1',
                title: 'New Widget',
                description: 'New Description',
                chartType: 'line',
                dataSource: 'newSource',
                indexData: 'newIndex',
                categoriesData: ['newCategory'],
                grid: { w: 3, h: 3, x: 1, y: 1 },
            };
            const mockChartData = { data: [4, 5, 6] };

            MongoDashboardConfig.create.mockResolvedValue(mockWidget);
            ChartDataService.getChartData.mockResolvedValue(mockChartData);

            const req = { body: { title: 'New Widget', description: 'New Description', chartType: 'line', dataSource: 'newSource', indexField: 'newIndex', categoryField1: 'newCategory', w: 3, h: 3, x: 1, y: 1 } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await DashboardController.createWidget(req, res, next);

            expect(MongoDashboardConfig.create).toHaveBeenCalledWith({
                title: 'New Widget',
                description: 'New Description',
                chartType: 'line',
                dataSource: 'newSource',
                indexData: 'newIndex',
                categoriesData: ['newCategory'],
                grid: { w: 3, h: 3, x: 1, y: 1 },
            });
            expect(ChartDataService.getChartData).toHaveBeenCalledWith('newSource', 'newIndex', 'newCategory');
            expect(res.json).toHaveBeenCalledWith({
                widget: {
                    id: '1',
                    title: 'New Widget',
                    description: 'New Description',
                    chartType: 'line',
                    dataSource: 'newSource',
                    indexData: 'newIndex',
                    categoriesData: ['newCategory'],
                    data: [4, 5, 6],
                    grid: { w: 3, h: 3, x: 1, y: 1 },
                }
            });
        });

        it('should handle errors', async () => {
            const error = new Error('Error creating widget');
            MongoDashboardConfig.create.mockRejectedValue(error);

            const req = { body: {} };
            const res = { sendStatus: jest.fn() };
            const next = jest.fn();

            await DashboardController.createWidget(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteWidget', () => {
        it('should delete a widget and return 200 status', async () => {
            MongoDashboardConfig.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const req = { params: { widgetId: '1' } };
            const res = { sendStatus: jest.fn() };
            const next = jest.fn();

            await DashboardController.deleteWidget(req, res, next);

            expect(MongoDashboardConfig.deleteOne).toHaveBeenCalledWith({ _id: '1' });
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });

        it('should handle errors', async () => {
            const error = new Error('Error deleting widget');
            MongoDashboardConfig.deleteOne.mockRejectedValue(error);

            const req = { params: { widgetId: '1' } };
            const res = { sendStatus: jest.fn() };
            const next = jest.fn();

            await DashboardController.deleteWidget(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('updateWidgets', () => {
        it('should update widgets and return success message', async () => {
            MongoDashboardConfig.findByIdAndUpdate.mockResolvedValue({});

            const req = { body: { widgets: [{ idWidget: '1', grid: { w: 2, h: 2, x: 0, y: 0 } }] } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            await DashboardController.updateWidgets(req, res, next);

            expect(MongoDashboardConfig.findByIdAndUpdate).toHaveBeenCalledWith({ _id: '1' }, { $set: { grid: { w: 2, h: 2, x: 0, y: 0 } } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Widgets updated successfully' });
        });

        it('should handle errors during update', async () => {
            const error = new Error('Error updating widgets');
            MongoDashboardConfig.findByIdAndUpdate.mockRejectedValue(error);

            const req = { body: { widgets: [{ idWidget: '1', grid: { w: 2, h: 2, x: 0, y: 0 } }] } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            await DashboardController.updateWidgets(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'An error occurred while updating widgets', error: 'Error updating widgets' });
        });

        it('should return 400 if widgets input is not an array', async () => {
            const req = { body: { widgets: {} } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            await DashboardController.updateWidgets(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input: expected an array of widget updates' });
        });
    });
});
