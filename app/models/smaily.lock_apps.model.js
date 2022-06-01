module.exports = (sequelize, Sequelize) => {
    const Lock_App = sequelize.define("lock_app", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING, //Sequelize.JSONB, 
            allowNull: false,
            defaultValue: 'Youtube'
        },
        isLocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    return Lock_App;
};