module.exports = {
    HOST: "localhost",
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