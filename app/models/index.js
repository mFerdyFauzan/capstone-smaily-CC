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
db.parent.hasMany(db.children, { as: "childrens" });
db.children.belongsTo(db.parent, {
    foreignKey: "parentId",
    as: "parent",
});
db.refreshToken.belongsTo(db.parent, {
    foreignKey: 'parentId', targetKey: 'id'
});
db.parent.hasOne(db.refreshToken, {
    foreignKey: 'parentId', targetKey: 'id'
});
/*
db.role = require("./smaily.role.model")(sequelize, Sequelize);
db.comment = require("./smaily.comment.model")(sequelize, Sequelize);
db.history = require("./smaily.history.model")(sequelize, Sequelize);
/*
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
db.user.hasMany(db.history, { as: "histories" });
db.user.hasMany(db.comment, { as: "comments" });
db.comment.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});
db.comment.belongsTo(db.history, {
    foreignKey: "historyId",
    as: "history"
});
db.history.hasMany(db.comment, { as: "comment" });
db.history.belongsTo(db.user, {
    foreignKey: {
        type: Sequelize.UUID,
        allowNull: false
    }
});
db.ROLES = ["admin", "parent", "children"];
*/
module.exports = db;