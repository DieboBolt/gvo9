var Sequelize = require("sequelize");
var sequelize = new Sequelize(null, null, null, {
    dialect: "sqlite",
    storage: __dirname + "/../database.sqlite"
});

var Url = sequelize.define("url", {
    url: {
        type: Sequelize.STRING,
        field: "url"
    },
    views: {
        type: Sequelize.INTEGER,
        field: "views"
    },
    key: {
        type: Sequelize.STRING,
        field: "key"
    }
});

module.exports= {
    sequelize: sequelize,
    Url: Url
};



















