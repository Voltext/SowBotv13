const Util = require("../../Utils/function")
const bdd = Util.getBDD();

module.exports = class PlayerMysql {

    static getPlayer(userId) {
        bdd.query(
            `SELECT * FROM players WHERE userId = ${userId}`,
            function(err, results, fields) {
              console.log(results); // results contains rows returned by server
              console.log(fields); // fields contains extra meta data about results, if available
            }
          );
    }

}