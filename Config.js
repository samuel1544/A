const config = {
    db:{
        host: process.env.MYSQLHOST || "localhost",
        user: process.env.MYSQLUSER || "root",
        password: process.env.MYSQLPASSWORD || "1544azebaze",
        database: process.env.MYSQLDATABASE || "client",
    }
};

module.exports = config;