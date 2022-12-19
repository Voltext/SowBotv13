const Util = require("../../Utils/function")

module.exports = class PlayerMysql {

    static bdd = Util.getBDD

    static getPlayer(userId) {
        this.bdd.execute(
            `SELECT * FROM players WHERE userId = ${userId}`,
            function(err, results, fields) {
                    return results
            }
          );
    }

}