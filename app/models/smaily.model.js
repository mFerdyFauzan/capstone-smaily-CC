module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
            /*
            validate: {
                is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/,
                isAlphanumeric: true
            }
            */
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        role: {
            type: Sequelize.ENUM({
                values: ['admin', 'parent', 'children', 'basic']
            }),
            allowNull: false,
            defaultValue: 'basic'
        }
    });
    return User;
};