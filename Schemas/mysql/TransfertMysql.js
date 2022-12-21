const db = require("./db")

module.exports = class TransfertMysql {
    static async insertTransfert(userId, poste, genre, profil) {
        const [data] = await db.execute(`INSERT INTO transferts (userId, poste, genre, profil) VALUES ('${userId}', '${poste}', '${genre}', '${profil}')`);
        return data
    }

}