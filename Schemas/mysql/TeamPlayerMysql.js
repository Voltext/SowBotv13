const db = require("./db")

module.exports = class TeamPlayerMysql {
    static async getTeamById(teamId) {
        const [data] = await db.execute(`SELECT * FROM teamplayers WHERE teamId = '${teamId}'`);
        return data
    }

    static async getPlayerById(playerId) {
      const [data] = await db.execute(`SELECT * FROM teamplayers WHERE userId = '${playerId}'`);
      return data
  }

  static async insertTeamPlayer(playerId, teamId) {
    const [data] = await db.execute(`INSERT INTO teamplayers (userId, teamId) VALUES ('${playerId}', '${teamId}')`);
        return data
}
    

}