const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true, select: false},
    username: {type:String, required:true, unique: true, trim: true},
    profilePicUrl:{type: String},

    newMessagePopup:{type:Boolean, default: true},
    unreadMessage: {type:Boolean, type:false},
    unreadNotification: {type:Boolean, type:false},
    role:{type: String, default:"user", enum:['user', 'root']},
    resetToken:{type:String},
    expireToken:{type:Date}
}, {timestamps: true}
);

module.exports=mongoose.model('User', UserSchema);