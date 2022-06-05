module.exports = (sequelize, Sequelize) => {
    const Lock_URL = sequelize.define("lock_url", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'http://www.youtube.com'
        },
        isLocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    return Lock_URL;
};