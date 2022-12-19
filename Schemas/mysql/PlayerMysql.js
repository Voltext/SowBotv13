const Util = require("../../Utils/function")
const {connection} = require("./Connect")

module.exports = class PlayerMysql {
    static getPlayer(userId) {
        connection.execute(
            `SELECT * FROM players WHERE userId = ${userId}`,
            function(err, results, fields) {
                return results
            }
          );
    }

}