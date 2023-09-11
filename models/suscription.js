const { Schema, model } = require('mongoose');

const SuscriptionSchema = Schema({
    endpoint: String,
    expirationTime: {
        type: String
    },
    keys: {
        p256dh:String,
        auth: String
    }
});

module.exports = model('Suscription', SuscriptionSchema);