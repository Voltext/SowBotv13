const db = require("./db")

module.exports = class LDLMTeam {
  static async getAllTeam() {
    const [data] = await db.execute(`SELECT * FROM ldlm_team`);
    return data
  }

  static async getTeamByUserId(userId) {
    const [data] = await db.execute(`SELECT * FROM ldlm_team WHERE teamOwner = '${userId}'`);
    return data
  }

  static async findTeamByPlayerID(id) {
    const [data] = await db.execute(`SELECT * FROM ldlm_teamplayers, ldlm_team where ldlm_teamplayers.idTeam = ldlm_team.id AND idPlayer=${id}`);
    return data
  }

}