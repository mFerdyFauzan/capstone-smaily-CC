module.exports = {
    secret: 'cd7144f9d2ed622fcc1712d47c1626424a076bb915fc0f038b84a1c2fa4aaebdb51ed2',
    jwtExpiration: 31556926,           // 1 year
    jwtRefreshExpiration: 31557000,   // 1 year + 1 minute
    connectTokenExpiration: 60, // 1 minute
    /* for test */
    //jwtExpiration: 300,          // 5 minute
    //jwtRefreshExpiration: 600,  // 10 minutes
};