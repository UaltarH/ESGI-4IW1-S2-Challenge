const mongoose = require('mongoose');

const dashboardConfigSchema = new mongoose.Schema({
    title: String,
    description: String,
    chartType: String,
    dataSource: String,
    indexData: String,
    categoriesData: [String],
    grid: {
        w: Number,
        h: Number,
    },
});

const MongoDashboardConfig = mongoose.model('DashboardConfig', dashboardConfigSchema);

module.exports = MongoDashboardConfig;
