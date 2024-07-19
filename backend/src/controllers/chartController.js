const MongoProduct = require('../mongo/models/MongoProduct');
const MongoOrder = require('../mongo/models/MongoOrder');
const e = require('express');

class ChartController {
    static async getDataForChart(req, res, next) {
        const { dataSource, indexField, categoryField1 } = req.body;

        let aggregationPipeline;
        if (dataSource === 'orders') {
            if (categoryField1 === 'totalAmount') {
                aggregationPipeline = [
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            totalAmount: { $sum: "$payment.amount" }
                        }
                    },
                    { $sort: { _id: 1 } }
                ];
            } else if (categoryField1 === 'orderCount') {
                aggregationPipeline = [
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            orderCount: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } }
                ];
            }
        } else if (dataSource === 'products') {
            aggregationPipeline = [
                {
                    $group: {
                        _id: `$${indexField}`,
                        [categoryField1]: { $avg: `$${categoryField1}` },
                    }
                },
                { $sort: { _id: 1 } }
            ];
        } else {
            return res.status(400).json({ message: "Invalid data source" });
        }

        let result;
        if (dataSource === 'products') {
            result = await MongoProduct.aggregate(aggregationPipeline);
        } else if (dataSource === 'orders') {
            result = await MongoOrder.aggregate(aggregationPipeline);
        } else {
            return res.status(400).json({ message: "Invalid data source" });
        }

        const formattedData = result.map(item => ({
            [indexField]: item._id,
            [categoryField1]: item[categoryField1],
        }));

        res.json({
            index: indexField,
            categories: [categoryField1],
            data: formattedData,
        });
    }
}

module.exports = ChartController;