const mongoose = require('./../mongoose')
let museumSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    }
})

let museumModel=mongoose.model('museum',museumSchema)

module.exports=museumModel