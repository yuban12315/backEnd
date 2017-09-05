let mongoose = require('./../mongoose')

let userSchema = new mongoose.Schema({
    nickname:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        index:true
    },
    password: {
        type: String,
        required: true
    },
    _salt:{
        type:String,
        required:true
    },
    location:{
        province:String,
        city:String
    }

})

let userModel = mongoose.model('user', userSchema)

module.exports = userModel