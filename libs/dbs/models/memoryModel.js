const mongoose = require('./../mongoose')

let memorySchema = mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    time: Date,
    photos: [{
        url: String,
        name: String,
        index: String
    }],
    published:Boolean,
    museumID:String,
    display:Number
})

let memoryModel = mongoose.model('memory', memorySchema)

module.exports = memoryModel