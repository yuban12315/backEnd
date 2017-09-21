const express = require('express'),
    async = require('async'),
    router = express.Router(),
    userModel = require('./../dbs/models/userModel'),
    userService = require('./../services/userService'),
    upload = require('./../utils/museumImage'),
    console = require('tracer').console(),
    fileService = require('./../services/fileService'),
    museumModel = require('./../dbs/models/museumModel'),
    mongoose = require('mongoose')

router.get('/', function (req, res, next) {
    res.send(`router about museums${req.ip}`)
})

//获取附近的museum
router.get('/nearBy', (req, res) => {
    let data = []
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
                const ip = req.ip
                userService.getAddress(ip, (error, response) => callback(error, response))
            }
        },
        //从数据库返回-city
        (location, callback) => {
            //console.log(location)
            museumModel.find({'location.city': location.city}, {
                name: 1,
                startTime: 1,
                admin: 1,
                image: 1,
                location: 1
            }).exec((error, docs) => {
                if (error) {
                    callback(error)
                } else {
                    //console.log(docs)
                    data = docs
                    callback(null, location)
                }
            })
        },
        //从数据库返回-province,
        (location, callback) => {
            museumModel.find({'location.province': location.province, 'location.city': {$ne: location.city}}, {
                name: 1,
                startTime: 1,
                admin: 1,
                image: 1,
                location: 1
            }).exec((error, docs) => {
                if (error) {
                    callback(error)
                } else {
                    //console.log(docs)
                    for (const i in docs) {
                        data.push(docs[i])
                    }
                    callback(null, data)
                }
            })
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
                msg: '返回附近的museum',
                data: result
            })
        }
    })
})

//museum detail
router.get('/detail', (req, res) => {
    let id = req.query.id || ''
    //console.log(id)
    async.waterfall([
            //string to objectID
            (callback) => {
                if (id.length !== 24) {
                    callback(new Error(`id长度应该为24，当前长度：${id.length}`))
                } else {
                    id = mongoose.Types.ObjectId(id)
                    callback(null, id)
                }
            },
            //获取museum信息
            (objectId, callback) => {
                console.log(objectId)
                museumModel.findOne({_id: objectId}).exec((error, doc) => {
                    if (error) {
                        callback(error)
                    } else {
                        if (doc === null) {
                            callback(new Error('无此博物馆'))
                        } else {
                            callback(null, doc)
                        }
                    }
                })
            },
            //获取museum里面的memory
            (document, callback) => {
                callback(null, document)
            }
        ],
        (error, result) => {
            if (error) {
                res.send({
                    status: false,
                    msg: error.message,
                    data: null
                })
            } else {
                res.send({
                    status: true,
                    msg: '返回museum的详细信息',
                    data: result
                })
            }
        })
})

//创建
router.post('/create', upload.single('image'), (req, res) => {

    let data = req.body || {}
    data = JSON.parse(data.info)
    console.log(data)
    async.waterfall([
        //图片处理
        (callback) => {
            if (!req.file) {
                callback(new Error('未获取到文件'))
            } else {
                const filename = req.file.filename
                fileService.upload(filename, (error, response) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        //console.log(response)
                        data.image = `http://ocxi5zst0.bkt.clouddn.com/${response.key}`
                        callback(null)
                    }
                })
            }
        },
        //存数据库
        (callback) => {
            const museum = new museumModel(data)
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
                msg: '创建museum成功'
            })
        }
    })
})

//修改
router.post('/update', upload.single('image'), (req, res) => {

})

module.exports = router
