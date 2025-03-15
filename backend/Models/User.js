const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
