const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        }
    });
    return Role;
};

/*
module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        /*
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
        
        name: {
            type: Sequelize.STRING,
            /*
            type: Sequelize.ENUM({
                values: ['admin', 'parent', 'children']
            }),
            
            allowNull: false,
        }
    });
    return Role;
}
*/