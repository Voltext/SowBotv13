const Util = require("../../Utils/function")

module.exports = class PlayerMysql {
    static getPlayer(userId) {
        console.log(Util.getBDD());
        bdd.query(
            `SELECT * FROM players WHERE userId = ${userId}`,
            function(err, results, fields) {
                return results
            }
          );
    }

}