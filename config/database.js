const mongoose = require('mongoose');
const {MONGO_URL} = process.env;

exports.connect = () => {
    console.log(MONGO_URL);
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("There is an error while connecting MongoDB");
        console.error(error);
        process.exit(1);
    });
}