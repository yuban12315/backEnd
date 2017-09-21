const mongoose = require('./../mongoose')

const memorySchema = mongoose.Schema({
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

const memoryModel = mongoose.model('memory', memorySchema)

module.exports = memoryModel