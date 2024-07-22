const MongoOrder = require('../mongo/models/MongoOrder');
const MongoProduct = require('../mongo/models/MongoProduct');

class ChartDataService {
    static async getChartData(dataSource, indexField, categoryField1) {
        let aggregationPipeline;
        let result;

        if (dataSource === 'orders') {
            aggregationPipeline = this.getOrdersAggregationPipeline(indexField, categoryField1);
            result = await MongoOrder.aggregate(aggregationPipeline);
        } else if (dataSource === 'products') {
            aggregationPipeline = this.getProductsAggregationPipeline(indexField, categoryField1);
            result = await MongoProduct.aggregate(aggregationPipeline);
        } else {
            throw new Error("Invalid data source");
        }

        const formattedData = result.map(item => ({
            [indexField]: item._id,
            [categoryField1]: item[categoryField1],
        }));

        return {
            data: formattedData,
        };
    }

    static getOrdersAggregationPipeline(indexField, categoryField1) {
        if (categoryField1 === 'totalAmount') {
            return [
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        totalAmount: { $sum: "$payment.amount" }
                    }
                },
                { $sort: { _id: 1 } }
            ];
        } else if (categoryField1 === 'orderCount') {
            return [
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        orderCount: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ];
        }
        throw new Error("Invalid category field for orders");
    }

    static getProductsAggregationPipeline(indexField, categoryField1) {
        return [
            {
                $group: {
                    _id: `$${indexField}`,
                    [categoryField1]: { $avg: `$${categoryField1}` },
                }
            },
            { $sort: { _id: 1 } }
        ];
    }
}

module.exports = ChartDataService;