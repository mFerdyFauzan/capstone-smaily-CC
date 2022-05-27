const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Children = sequelize.define("children", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        }
    });
    return Children;
};