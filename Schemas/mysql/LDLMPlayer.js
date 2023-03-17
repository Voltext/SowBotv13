const db = require("./db")

module.exports = class LDLMPlayer {
  static async getAllPlayers() {
    const [data] = await db.execute(`SELECT * FROM ldlm_players`);
    return data
  }

  static async getPlayerByID(id) {
    const [data] = await db.execute(`SELECT * FROM ldlm_players where ID=${id}`);
    return data
  }

  static async getPlayerStats(idPlayer) {
    const [data] = await db.execute(`SELECT * FROM ldlm_playerstat, ldlm_players, ldlm_stats WHERE ldlm_playerstat.idStat = ldlm_stats.id AND ldlm_playerstat.idPlayer = ldlm_players.ID AND ID=${id}`);
    return data
  }
  

}