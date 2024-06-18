const fs = require('node:fs');
const path = require('node:path');
const connection = require('./db.js');

const files = fs.readdirSync(__dirname);
const db = {
    connection: connection
};


for (const file of files){
    if (['index.js', 'db.js'].includes(file)){
        continue;
    }
    const model = require(path.join(__dirname,file))(sequelize);
    db[model.name] = model;
}

module.exports = db;