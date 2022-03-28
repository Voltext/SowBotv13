require('dotenv').config();
module.exports = class Utils {
    static async getMemberRole(user) {
        const roles = user._roles
        let type = "";
        let min = 0
        let max = 0

        if (roles.includes(process.env.MEMBRE)) {
            type = 'Commune'
            min = 70
            max = 82
        } else if (roles.includes(process.env.MODO_ID)) {
            type = 'Rare'
            min = 82
            max = 85
        } else if (roles.includes(process.env.RESPONSABLE)) {
            type = 'Epique'
            min = 85
            max = 92
        }
        return [type, min, max]
    }

    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static numAverage(a) {
        var b = a.length,
            c = 0, i;
        for (i = 0; i < b; i++){
          c += Number(a[i]);
        }
        return c/b;
      }
}