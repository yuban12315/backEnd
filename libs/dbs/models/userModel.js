const mongoose = require('./../mongoose')

const userSchema = new mongoose.Schema({

    //基本信息
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
    },
    sex:String,
    desc:String,
    avatar:{
        type:String,
        default:'http://ocxi5zst0.bkt.clouddn.com/5657474daecbe02.jpg'
    }
    // collect:[{
    //     id:mongoose.Types.ObjectId
    // }]

    //管理员（museum）

})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel