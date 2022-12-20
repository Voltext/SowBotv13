const db = require("./db")

module.exports = class PlayerMysql {
    static async getPlayer(userId) {
        const [data] = await db.execute(`SELECT * FROM players WHERE userId = '${userId}'`);
        return data
    }

    static async insertStat(userId, infos) {
        const [data] = await db.execute(`UPDATE players SET stamina=${infos.stamina}, ${infos.idStat}=${infos.stat}, success=${infos.succes}, isInjured=${infos.isInjured} WHERE userId = '${userId}'`);
        return data
    }

}