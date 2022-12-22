const db = require("./db")

module.exports = class TransfertMysql {
    static async insertTransfert(joueur, from, to, montant, thread, statut) {
        const [data] = await db.execute(`INSERT INTO transferts (joueurId, fromTeamId, toTeamId, montant, threadId, status) VALUES ('${joueur}', '${from}', '${to}', '${montant}', '${thread}', '${statut}')`);
        return data
    }

}