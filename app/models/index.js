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
db.user = require("./smaily.user.model")(sequelize, Sequelize);
db.role = require("./smaily.role.model")(sequelize, Sequelize);
db.comment = require("./smaily.comment.model")(sequelize, Sequelize);
db.history = require("./smaily.history.model")(sequelize, Sequelize);
db.refreshToken = require("./smaily.refreshToken.model")(sequelize, Sequelize);
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});
db.refreshToken.belongsTo(db.user, {
    foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
    foreignKey: 'userId', targetKey: 'id'
});
db.user.hasMany(db.history);
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);
db.comment.belongsTo(db.history);
db.history.hasMany(db.comment);
db.history.belongsTo(db.user);
db.ROLES = ["admin", "parent", "children"];
module.exports = db;