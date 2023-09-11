const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);

        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error on database initialization');
    }
}

module.exports = {
    dbConnection
}