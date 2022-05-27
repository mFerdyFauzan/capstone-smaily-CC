const { nanoid } = require("nanoid");
const { sequelize, Sequelize } = require(".");
const config = require("../auth/auth.config");

module.exports = (sequelize, Sequelize) => {
    const ConnectToken = sequelize.define("connectToken", {
        token: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        expiryDate: {
            type: Sequelize.DATE,
        }
    });
    ConnectToken.createToken = async function (user) {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + config.connectTokenExpiration);
        let _token = nanoid(5);
        let connectToken = await this.create({
            token: _token,
            parentId: user.parentId,
            childrenId: user.id,
            expiryDate: expiredAt.getTime(),
        });
        return connectToken.token;
    };
    ConnectToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };
    return ConnectToken;
};