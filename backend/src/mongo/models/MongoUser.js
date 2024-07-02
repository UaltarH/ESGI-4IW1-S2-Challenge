const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    postgresId: String,
    firstname: String,
    lastname: String,
    email: String,
    address: String,
    city: String,
    zipcode: Number,
    country: {
        type: String,
        default: "France",
    },
    phone: String,
    birthdate: Date,
    role: {
        type: String,
        enum: ["admin", "user", "store_manager", "accountant"],
        default: "user",
    },
});

const MongoUser = mongoose.model('User', userSchema);

module.exports = MongoUser;