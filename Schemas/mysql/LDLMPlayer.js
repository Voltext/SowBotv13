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
  

}