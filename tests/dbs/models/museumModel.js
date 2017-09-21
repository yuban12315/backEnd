let museumModel = require('./../../../libs/dbs/models/museumModel')
let console = require('tracer').console()
let async=require('async')

museumModel.find().exec((error, docs)=>{
    console.log(docs)
    async.map
})