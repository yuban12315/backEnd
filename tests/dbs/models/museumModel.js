let museumModel = require('./../../../libs/dbs/models/museumModel')
let async = require('async')
let mongoose=require('mongoose')

// museumModel.find().exec((error, docs) => {
//     console.log(docs)
//     async.map(docs, (i, callback) => {
//         console.log(i)+

//         museumModel.update({_id: i._id}, {
//             $set: {
//                 image:i.image
//             }
//         }).exec((error, doc) => callback(error, doc))
//     }, (error, docs) => {
//         if (error) console.log(error)
//         if (docs) console.log(docs)
//     })
// })

let _id="59bf879bdf0fd03ce8414f59"
console.log(_id.length)
let id=mongoose.Types.ObjectId(_id)
console.log(typeof (id))