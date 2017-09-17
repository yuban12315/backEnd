let express = require('express'),
    async = require('async'),
    router = express.Router(),
    userModel = require('./../dbs/models/userModel'),
    userService = require('./../services/userService'),
    upload = require('./../utils/museumImage'),
    console = require('tracer').console(),
    fileService = require('./../services/fileService'),
    museumModel = require('./../dbs/models/museumModel')


router.get('/', function (req, res, next) {
    res.send("router about museums" + req.ip)
});

//获取附近的museum
router.get('/nearBy', (req, res) => {
    async.waterfall([
        //地址信息
        (callback) => {
            //登录用户从数据库获取地址信息
            if (req.session.logged) {
                userModel.findOne({email: req.session.email}, {location: 1, email: 1}).exec((error, doc) => {
                    callback(error, doc.location)
                })
            }
            //未登录用户使用ip判断地址
            else {
                let ip
                if (req.ip = '127.0.0.1') ip = '183.175.12.157'
                else ip = req.ip
            }
        },
        //从数据库返回-city
        (location, callback) => {
            console.log(location)
            museumModel.find()
            callback(null)
        }

    ], (error, result) => {
        if (error) {
            res.send({
                status: false,
                msg: error.message,
                data: null
            })
        } else {
            res.send({
                status: true,
                msg: "返回附近的museum",
                data: result
            })
        }
    })

})

//暂时只能本机使用
//创建
router.post('/create', upload.single("image"), (req, res) => {
    if (req.ip === "127.0.0.1") {
        let data = req.body || {}
        data = JSON.parse(data.info)
        console.log(data)
        async.waterfall([
            //图片处理
            (callback) => {
                if (!req.file) {
                    callback(new Error("未获取到文件"))
                } else {
                    let filename = req.file.filename
                    fileService.upload(filename, (error, response) => {
                        if (error) {
                            callback(error)
                        }
                        else {
                            //console.log(response)
                            data.image = response.key
                            callback(null)
                        }
                    })
                }
            },
            //存数据库
            (callback) => {
                let museum = new museumModel(data)
                museum.save((error, docs) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null)
                    }
                })
            }
        ], (err) => {
            if (err) {
                res.send({
                    status: false,
                    msg: err.message
                })
            }
            else {
                res.send({
                    status: true,
                    msg: "创建museum成功"
                })
            }
        })
    }
    else {
        res.status(403)
        res.send({
            status: false,
            msg: '403 Forbidden'
        })
    }
})

module.exports = router;
