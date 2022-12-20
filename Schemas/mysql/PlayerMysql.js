const db = require("./db")

module.exports = class PlayerMysql {
    static async getPlayer(userId) {
        const [data] = await db.execute(`SELECT * FROM players WHERE userId = '${userId}'`);
        return data
    }

    static async insertStat(userId, stamina, success) {
        const [data] = await db.execute(`SELECT * FROM players WHERE userId = '${userId}'`);
        return data
    }

}