const mongoose = require('./../mongoose')
const museumSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image:{
        type:String
    },
    startTime: {
        type: Date
    },
    desc: {
        type: String
    },
    location: {
        province: {
            type: String,
            index: true
        },
        city:  {
            type: String,
            index: true
        },
        //详细地址
        loc: String
    },
    admin:{
        email:{
            type:String,
            default:'455678228@qq.com'
        }
    }
})

const museumModel=mongoose.model('museum',museumSchema)

module.exports=museumModel