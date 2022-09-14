require('dotenv').config();
const mongo = require('../mongo');
const reponseSchema = require('../Schemas/reponseSchema');
const battleSchema = require('../Schemas/battleSchema');
const pronoSchema = require('../Schemas/pronoSchema');
const counterSchema = require('../Schemas/counterSchema');
const { MessageEmbed } = require('discord.js');

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

    static cleanVar(value) {
        return value.replace(' ', '').replace('\n', '')
    }

    static difference(a, b) {
        return Math.abs(a - b);
      }

      static addStat(userId, stat, point, stamina, userObj) {
          console.log(this.findValueByPrefix(userObj, stat))
      }

      static findValueByPrefix(object, prefix) {
        for (var property in object) {
          if (object.hasOwnProperty(property) && 
             property.toString().startsWith(prefix)) {
             return object[property];
          }
        }
      }

      static validScoreRegex(regexValue) {
        const regex = /[a-zA-Z]+/i;
        return regex.test(regexValue);
    }

    static errorEmbed(titre, description) {
        return new MessageEmbed().setColor("RED").setTitle(titre).setDescription(description);
    }

    static successEmbed(titre, description) {
        return new MessageEmbed().setColor("GREEN").setTitle(titre).setDescription(description);
    }

      static async clearAll() {
        await mongo().then(async (mongooseresetprono) => {
            try {
                await pronoSchema.deleteMany({})
            } catch {
                console.log("Erreur function clearAll: function(76)")
                mongooseresetprono.connection.close()
            }
        })
        await mongo().then(async (mongooseresetbattle) => {
            try {
                await battleSchema.deleteMany({})
            } catch {
                console.log("Erreur function clearAll: function(84)")
                mongooseresetbattle.connection.close()
            }
        })
        await mongo().then(async (mongooseresetreponse) => {
            try {
                await reponseSchema.deleteMany({})
            } catch {
                console.log("Erreur function clearAll: function(92)")
                mongooseresetreponse.connection.close()
            }
        })
        await mongo().then(async (mongooseresetcounter) => {
            try {
                await counterSchema.deleteMany({})
            } catch {
                console.log("Erreur function clearAll: function(100)")
                mongooseresetcounter.connection.close()
            }
        })
      }
}