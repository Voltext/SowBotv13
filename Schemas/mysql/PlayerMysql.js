const bdd = require("./Connect")

module.exports = class PlayerMysql {
    static getPlayer(userId) {
        console.log(bdd);
        bdd.connection.query(
            `SELECT * FROM players WHERE userId = ${userId}`,
            function(err, results, fields) {
                return results
            }
          );
    }

}