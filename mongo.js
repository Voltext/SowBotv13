const mongoose = require('mongoose');
require('dotenv').config();
const environnement = ""

if(process.env.ENV == "PROD") {
	environnement = process.env.MONGO_PATH
}
else {
	environnement = process.env.MONGO_DEV
}

module.exports = async () => {
	await mongoose.connect(environnement, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	return mongoose;
};
