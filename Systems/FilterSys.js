const Schema = require("../Schemas/filterSchema");
const mongo = require('../mongo');

module.exports = (client) => {
  mongo().then(async (mongooseclient) => {
    try {
      Schema.find().then((documents) => {
        documents.forEach((doc) => {
          client.filters.set(doc.Guild, doc.Words);
          client.filtersLog.set(doc.Guild, doc.Log);
        });
      });
    } finally {
      mongooseclient.connection.close()
    }
  })
};
