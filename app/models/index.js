const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.parent = require("./smaily.parent.model")(sequelize, Sequelize);
db.children = require("./smaily.children.model")(sequelize, Sequelize);
db.refreshToken = require("./smaily.refreshToken.model")(sequelize, Sequelize);
db.connectToken = require("./smaily.connectToken.model")(sequelize, Sequelize);
db.lock = require("./smaily.lock.model")(sequelize, Sequelize);
db.lock_app = require("./smaily.lock_apps.model")(sequelize, Sequelize);
db.lock_url = require("./smaily.lock_url.model")(sequelize, Sequelize);
db.parent.hasOne(db.children);
db.children.belongsTo(db.parent, {
    foreignKey: "parentId",
});
db.refreshToken.belongsTo(db.parent, {
    foreignKey: 'parentId', targetKey: 'id'
});
db.parent.hasOne(db.refreshToken, {
    foreignKey: 'parentId', targetKey: 'id'
});
db.connectToken.belongsTo(db.parent, {
    foreignKey: 'parentId', targetKey: 'id'
});
db.parent.hasOne(db.connectToken, {
    foreignKey: 'parentId', targetKey: 'id'
});
db.connectToken.belongsTo(db.children, {
    foreignKey: 'childrenId', targetKey: 'id'
});
db.children.hasOne(db.connectToken, {
    foreignKey: 'childrenId', targetKey: 'id'
});
db.parent.hasOne(db.lock, {
    foreignKey: 'parentId', targetKey: 'id'
});
db.children.hasOne(db.lock, {
    foreignKey: 'childrenId', targetKey: 'id'
});
db.lock.belongsTo(db.parent, {
    foreignKey: 'parentId', targetKey: 'id'
});
db.lock.belongsTo(db.children, {
    foreignKey: 'childrenId', targetKey: 'id'
})
db.lock.hasOne(db.lock_app, {
    foreignKey: 'lockId', targetKey: 'id'
});
db.lock_app.belongsTo(db.lock, {
    foreignKey: 'lockId', target: 'id'
});
db.lock_url.belongsTo(db.lock, {
    foreignKey: 'lockId', target: 'id'
});
module.exports = db;