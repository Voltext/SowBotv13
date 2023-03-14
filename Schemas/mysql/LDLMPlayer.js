const db = require("./db")

module.exports = class LDLMPlayer {
  static async getAllTeam() {
    const [data] = await db.execute(`SELECT * FROM ldlm_team`);
    return data
  }

  static async getTeamByUserId(userId) {
    const [data] = await db.execute(`SELECT * FROM ldlm_team WHERE teamOwner = '${userId}'`);
    return data
  }

}