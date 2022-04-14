require('dotenv').config();
module.exports = class Utils {
    static async getMemberRole(user) {
        const roles = user._roles
        let type = "";
        let min = 0
        let max = 0

        if (roles.includes(process.env.MEMBRE) && !roles.includes(process.env.MODO_ID) && !roles.includes(process.env.RESPONSABLE)) {
            type = 'Commune'
            min = 70
            max = 82
        } else if (roles.includes(process.env.MODO_ID) && !roles.includes(process.env.RESPONSABLE)) {
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

    static getRandomNumbers(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static getRandomNumber(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static numAverage(a) {
        var b = a.length,
            c = 0,
            i;
        for (i = 0; i < b; i++) {
            c += Number(a[i]);
        }
        return c / b;
    }

    /* static getInfoReset(guild, userId) {
        let battleRole = guild.roles.cache.get(process.env.BATTLE);
        const member = guild.members.fetch(userId)
        //member.roles.add(battleRole)

        return member.user.displayAvatarURL({
            format: 'png',
          })

    } */
}