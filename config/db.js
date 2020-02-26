const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB =  async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('Connected to mongo DB.....')
    }
    catch (err){
        console.log(err.message);
        //exit process if fialed
        process.exit(1);
    }
}

module.exports = connectDB;