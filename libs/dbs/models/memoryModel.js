const mongoose = require('./../mongoose')

let memorySchema = mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    owner: {
        type: ObjectId
    },
    time: Date,
    photos: [{
        url: String,
        name: String,
        index: String
    }],
    published:Boolean,
    display:Number
})

let memoryModel = mongoose.model('memory', memorySchema)

module.exports = memoryModel