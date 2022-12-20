const db = require("./db")

module.exports = class PlayerMysql {
    static async getPlayer(userId) {
        const [data] = await db.execute(`SELECT * FROM players WHERE userId = '${userId}'`);
        return data
    }

    static async insertStat(userId, data) {
        console.log(userId)
        console.log(data)
        /* const [data] = await db.execute(`SELECT * FROM players WHERE userId = '${userId}'`);
        return data */
    }

}