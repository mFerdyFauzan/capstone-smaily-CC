module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "",
    DB: "testdb",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 90000,
        idle: 60000
    }
};