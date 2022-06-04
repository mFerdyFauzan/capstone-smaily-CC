module.exports = {
    HOST: "34.143.167.65",
    USER: "postgres",
    PASSWORD: "123",
    DB: "testdb",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 90000,
        idle: 60000
    }
};