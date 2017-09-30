const mongoose = require('./../mongoose')

const memorySchema = mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    time: Date,
    photos: [{
        url: String,
        name: String,
        index: Number
    }],
    published: Boolean,
    museumID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    display: Number,
    like: {
        type: Number,
        default: 0
    },

    view: {
        type: Number,
        default: 0
    }
})

const memoryModel = mongoose.model('memory', memorySchema)

module.exports = memoryModel