module.exports = {
    secret: 'cd7144f9d2ed622fcc1712d47c1626424a076bb915fc0f038b84a1c2fa4aaebdb51ed2',
    //jwtExpiration: 3600,           // 1 hour
    //jwtRefreshExpiration: 86400,   // 24 hours
    /* for test */
    jwtExpiration: 300,          // 5 minute
    jwtRefreshExpiration: 600,  // 10 minutes
    connectTokenExpiration: 60, // 1 minute
    connectRefreshExpiration: 120 // 2 minutes
};