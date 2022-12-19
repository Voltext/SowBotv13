const Util = require("../../Utils/function")
const bdd = Util.getBDD();

module.exports = class PlayerMysql {
    static getPlayer(userId) {
        console.log(bdd)
        bdd.query(
            `SELECT * FROM players WHERE userId = ${userId}`,
            function(err, results, fields) {
                return results
            }
          );
    }

}