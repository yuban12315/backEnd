let express = require('express'),
    async = require('async'),
    router = express.Router(),
    userModel = require('./../dbs/models/userModel'),
    userService = require('./../services/userService'),
    upload = require('./../utils/memoryImage'),
    console = require('tracer').console(),
    fileService = require('./../services/fileService'),
    memoryModel=require('./../dbs/models/memoryModel')


router.get('/', function (req, res, next) {
    res.send("router about memories" + req.ip)
})

router.post('/create',(req, res)=>{
    let data=req.body||{}
    // async.waterfall([
    //
    // ])
})

router.post("/testFile",upload.array("image"),(req, res)=>{
    let data = req.body || {}
    console.log(data || "data = null")
    console.log(req.file || "file = null")
    //let filename = req.file.filename

    res.send({
        file: req.file,
        data: req.body
    })
})

// router.post('/testFile', upload.single("avatar"), (req, res) => {
//     let data = req.body || {}
//     console.log(data || "data = null")
//     console.log(req.file || "file = null")
//     //let filename = req.file.filename
//
//     res.send({
//         file: req.file,
//         data: req.body
//     })
// })




module.exports = router;
