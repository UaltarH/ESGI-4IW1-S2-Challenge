const ChartDataService = require('../services/dashboardService');
const MongoDashboardConfig = require('../mongo/models/MongoDashboardConfig');

class DashboardController {
    static async getWidgets(req, res, next) {
        try {
            let widgetsRes = [];
            const widgets = await MongoDashboardConfig.find();
            console.log(widgets);
            for (let widget of widgets) {
                const chartData = await ChartDataService.getChartData(widget.dataSource, widget.indexData, widget.categoriesData[0]);
                widgetsRes.push({
                    id: widget._id,
                    title: widget.title,
                    description: widget.description,
                    chartType: widget.chartType,
                    dataSource: widget.dataSource,
                    indexData: widget.indexData,
                    categoriesData: widget.categoriesData,
                    data: chartData.data,
                    grid: widget.grid,
                });
            }

            res.json({ widgets: widgetsRes });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    static async createWidget(req, res, next) {
        try {
            const { title, description, chartType, dataSource, indexField, categoryField1, w, h } = req.body;

            const newWidget = await MongoDashboardConfig.create({
                title,
                description,
                chartType,
                dataSource,
                indexData: indexField,
                categoriesData: [categoryField1],
                grid: { w, h },
            });
            const chartData = await ChartDataService.getChartData(dataSource, indexField, categoryField1);

            const widgetsRes = {
                id: newWidget._id,
                title: newWidget.title,
                description: newWidget.description,
                chartType: newWidget.chartType,
                dataSource: newWidget.dataSource,
                indexData: newWidget.indexData,
                categoriesData: newWidget.categoriesData,
                data: chartData.data,
                grid: newWidget.grid,
            };


            res.json({ widget: widgetsRes });
        } catch (error) {
            res.sendStatus(500);
        }
    }

    static async deleteWidget(req, res, next) {
        try {
            const { widgetId } = req.params;
            await MongoDashboardConfig.deleteOne({ _id: widgetId });
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
        }
    }
}

module.exports = DashboardController;