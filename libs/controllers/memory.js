const express = require('express'),
    async = require('async'),
    router = express.Router(),
    userModel = require('./../dbs/models/userModel'),
    userService = require('./../services/userService'),
    upload = require('./../utils/memoryImage'),
    console = require('tracer').console(),
    fileService = require('../services/fileService_old'),
    memoryModel=require('./../dbs/models/memoryModel')

router.get('/', function(req, res, next) {
    res.send(`router about memories${req.ip}`)
})

router.post('/create',(req, res)=>{
    const data=req.body||{}
    // async.waterfall([
    //
    // ])
})

router.post('/testFile',upload.array('image'),(req, res)=>{
    const data = req.body || {}
    console.log(data || 'data = null')
    console.log(req.file || 'file = null')
    //let filename = req.file.filename
    console.log(req.files)

    res.send({
        file: req.file,
        data: req.body
    })
})

module.exports = router
