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

router.get('/', (req, res) => {
    res.send(`router about museums${req.ip}`)
})

//获取附近的museum
router.get('/nearBy', async (req, res) => {
    try {
        let location
        //登录用户从数据库获取地址信息
        if (req.session.logged) {
            const email = req.session.email
            const doc = await userModel.find(email, {location: 1, email: 1})
            location = doc.location
        }
        //未登录用户使用ip判断地址
        else {
            const ip = req.ip
            location = await userService.getAdress(ip)
        }
        let data = []
        const dataByCity = await museumModel.find({'location.city': location.city}, {
            name: 1,
            startTime: 1,
            admin: 1,
            image: 1,
            location: 1
        })
        data = dataByCity
        const dataByProvince = await museumModel.find({'location.province': location.province}, {
            name: 1,
            startTime: 1,
            admin: 1,
            image: 1,
            location: 1
        })
        let flag, i, k
        for (i in dataByProvince) {
            flag = true
            for (k in dataByCity) {
                if (dataByCity[k]._id === dataByProvince[i]._id) {
                    flag = false
                }
            }
            if (flag) {
                data.push(dataByProvince[k])
            }
            data.push(dataByProvince[i])
        }
        res.send({
            status: true,
            msg: '返回附近的museum',
            data
        })
    } catch (error) {
        res.send({
            status: false,
            msg: `${error.name} : ${error.message}`,
            data: null
        })
    }
})

//museum detail
router.get('/detail', async (req, res) => {
    const id = req.query.id || ''
    try {
        if (id.length !== 24) {
            throw new TypeError(`id 需要是长度为24的ObjectID，当前长度：${id.length}`)
        }
        const _id = mongoose.Types.ObjectId(id)
        const doc = await museumModel.findOne({_id})
        //获取museum里面的memory(default)
        res.send({
            status: true,
            msg: 'museum详细信息',
            data: doc
        })
    } catch (error) {
        res.send({
            status: false,
            msg: `${error.name} : ${error.message}`,
            data: null
        })
    }
})

//创建
router.post('/create', upload.single('image'), async (req, res) => {

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
