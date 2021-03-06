const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', UserSchema);
