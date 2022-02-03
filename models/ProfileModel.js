const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref: "User"},
    bio:{type: String, required:true},
    social: {
        youtube:{type: String, required:false},
        twitter:{type: String, required:false},
        instagram:{type: String, required:false},
        facebook:{type: String, required:false},
    }
})

module.exports = mongoose.model('Profile', ProfileSchema)