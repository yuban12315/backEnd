const museumModel = require('./../../../libs/dbs/models/museumModel')
const async = require('async')
const mongoose = require('mongoose')

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

const _id = '59bf879bdf0fd03ce8414f59'

async function run() {
    const cursor =await museumModel.find({_id}).cursor();
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        // Prints "Val" followed by "Varun"
        console.log(doc);
    }
}
run()