const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Lock = sequelize.define("lock", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        }
    });
    return Lock;
};