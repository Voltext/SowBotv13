const Schema = require("../Schemas/filterSchema");
const mongo = require('../mongo');

module.exports = async (client) => {
  await mongo().then(async (mongoosefiltre) => {
    try {
      await Schema.find().then((documents) => {
        documents.forEach((doc) => {
          client.filters.set(doc.Guild, doc.Words);
          client.filtersLog.set(doc.Guild, doc.Log);
        });
      });
    } catch {
      mongoosefiltre.connection.close();
    }
  });
};