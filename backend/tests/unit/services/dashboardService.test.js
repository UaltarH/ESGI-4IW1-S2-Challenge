const ChartDataService = require('../../../src/services/dashboardService');
const MongoOrder = require('../../../src/mongo/models/MongoOrder');
const MongoProduct = require('../../../src/mongo/models/MongoProduct');

jest.mock('../../../src/mongo/models/MongoOrder');
jest.mock('../../../src/mongo/models/MongoProduct');

describe('ChartDataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getChartData', () => {
    it('devrait retourner les données formatées pour les commandes (totalAmount)', async () => {
      const mockResult = [
        { _id: '2023-07-23', totalAmount: 100 },
        { _id: '2023-07-24', totalAmount: 200 },
      ];
      MongoOrder.aggregate.mockResolvedValue(mockResult);

      const result = await ChartDataService.getChartData('orders', 'date', 'totalAmount');

      expect(MongoOrder.aggregate).toHaveBeenCalledWith(expect.any(Array));
      expect(result).toEqual({
        data: [
          { date: '2023-07-23', totalAmount: 100 },
          { date: '2023-07-24', totalAmount: 200 },
        ],
      });
    });

    it('devrait retourner les données formatées pour les commandes (orderCount)', async () => {
      const mockResult = [
        { _id: '2023-07-23', orderCount: 5 },
        { _id: '2023-07-24', orderCount: 8 },
      ];
      MongoOrder.aggregate.mockResolvedValue(mockResult);

      const result = await ChartDataService.getChartData('orders', 'date', 'orderCount');

      expect(MongoOrder.aggregate).toHaveBeenCalledWith(expect.any(Array));
      expect(result).toEqual({
        data: [
          { date: '2023-07-23', orderCount: 5 },
          { date: '2023-07-24', orderCount: 8 },
        ],
      });
    });

    it('devrait retourner les données formatées pour les produits', async () => {
      const mockResult = [
        { _id: 'category1', price: 50 },
        { _id: 'category2', price: 75 },
      ];
      MongoProduct.aggregate.mockResolvedValue(mockResult);

      const result = await ChartDataService.getChartData('products', 'category', 'price');

      expect(MongoProduct.aggregate).toHaveBeenCalledWith(expect.any(Array));
      expect(result).toEqual({
        data: [
          { category: 'category1', price: 50 },
          { category: 'category2', price: 75 },
        ],
      });
    });

    it('devrait lancer une erreur pour une source de données invalide', async () => {
      await expect(ChartDataService.getChartData('invalid', 'field', 'category'))
        .rejects.toThrow('Invalid data source');
    });

    it('devrait lancer une erreur pour un champ de catégorie invalide pour les commandes', async () => {
      await expect(ChartDataService.getChartData('orders', 'date', 'invalidField'))
        .rejects.toThrow('Invalid category field for orders');
    });
  });

  describe('getOrdersAggregationPipeline', () => {
    it('devrait retourner le pipeline correct pour totalAmount', () => {
      const pipeline = ChartDataService.getOrdersAggregationPipeline('date', 'totalAmount');
      expect(pipeline).toEqual([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalAmount: { $sum: "$payment.amount" }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    });

    it('devrait retourner le pipeline correct pour orderCount', () => {
      const pipeline = ChartDataService.getOrdersAggregationPipeline('date', 'orderCount');
      expect(pipeline).toEqual([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    });
  });

  describe('getProductsAggregationPipeline', () => {
    it('devrait retourner le pipeline correct pour les produits', () => {
      const pipeline = ChartDataService.getProductsAggregationPipeline('category', 'price');
      expect(pipeline).toEqual([
        {
          $group: {
            _id: "$category",
            price: { $avg: "$price" },
          }
        },
        { $sort: { _id: 1 } }
      ]);
    });
  });
});