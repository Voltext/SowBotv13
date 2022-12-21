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

    static async insertTeam(teamName, idCapitaine) {
      let [data] = ""
        db.execute(`INSERT INTO teams (teamName, idCapitaine) VALUES ('${teamName}', '${idCapitaine}')`)
        .then((result) => {
          data = result.insertId
        })
        return data
    }

}