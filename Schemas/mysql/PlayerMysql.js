const db = require("./db")

module.exports = class PlayerMysql {
    static async getPlayer(userId) {
        const [data] = await db.execute(`SELECT * FROM players WHERE userId = '${userId}'`);
        return data
    }

    static async insertStat(userId, data) {
        const [data] = await db.execute(`UPDATE players SET stamina=${data.stamina}, ${data.idStat}=${data.stat}, success=${data.succes}, isInjured=${data.isInjured} WHERE userId = '${userId}'`);
        return data
    }

}