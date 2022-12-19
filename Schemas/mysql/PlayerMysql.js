const Util = require("../../Utils/function")
const bdd = Util.getBDD();

module.exports = class PlayerMysql {

    static getPlayer(userId) {
        bdd.execute(
            `SELECT * FROM players WHERE userId = ${userId}`,
            function(err, results, fields) {
                    return results
            }
          );
    }

}