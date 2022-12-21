const db = require("./db")

module.exports = class TeamMysql {
    static async getTeamById(teamId) {
        const [data] = await db.execute(`SELECT * FROM teams WHERE id = '${teamId}'`);
        return data
    }

    static async getTeamByName(teamName) {
      const [data] = await db.execute(`SELECT * FROM teams WHERE teamName = '${teamName}'`);
      return data
  }

  static async getTeamByCaptainId(captainId) {
    const [data] = await db.execute(`SELECT * FROM teams WHERE idCapitaine = '${captainId}'`);
    return data
}

    static insertTeam(teamName, idCapitaine) {
      let data = ""
        db.execute(`INSERT INTO teams (teamName, idCapitaine) VALUES ('${teamName}', '${idCapitaine}')`, function(err, result, fields) {
          if (err) throw err;
          data = result.insertId
        });
        return data
    }

}