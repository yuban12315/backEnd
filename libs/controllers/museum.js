const express = require('express'),
    router = express.Router(),
    userModel = require('./../dbs/models/userModel'),
    userService = require('./../services/userService'),
    upload = require('./../utils/upload'),
    console = require('tracer').console(),
    fileService = require('../services/fileService'),
    museumModel = require('./../dbs/models/museumModel'),
    memoryModel = require('./../dbs/models/memoryModel'),
    mongoose = require('mongoose')

router.get('/', (req, res) => {
    res.send(`router about museums${req.ip}`)
})

//获取附近的museum
router.get('/nearBy', async (req, res, next) => {
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
        next(error)
    }
})

//museum detail
router.get('/detail', async (req, res, next) => {
    const id = req.query.id || ''
    try {
        if (id.length !== 24) {
            throw new TypeError(`id 需要是长度为24的ObjectID，当前长度：${id.length}`)
        }
        const _id = mongoose.Types.ObjectId(id)
        const doc = await museumModel.findOne({_id})
        if (doc === null) {
            throw new Error('无此博物馆')
        }
        //获取museum里面的memory(default)
        const docs = await memoryModel.find({museumID: _id})
        const data=JSON.parse(JSON.stringify(doc))
        console.log(docs)
        data.memories = docs
        console.log(doc)
        res.send({
            status: true,
            msg: 'museum详细信息',
            data
        })
    } catch (error) {
        next(error)
    }
})

//创建
router.post('/create', upload.single('image'), async (req, res, next) => {
    try {
        let data = req.body || {}
        data = JSON.parse(data.info)
        console.log(data)
        const resBody = await fileService.upload(req.file, 'museum')
        data.image = `http://ocxi5zst0.bkt.clouddn.com/${resBody.key}`
        const museum = new museumModel(data)
        await museum.save()
        res.send({
            status: true,
            msg: '创建museum成功'
        })
    } catch (error) {
        next(error)
    }
})

//修改
router.post('/update', upload.single('image'), (req, res) => {
    for (const i in req.file) {
        console.log(i)
        console.log(req.file[i].toString().substring(0, 20))
    }
    res.send(req.file)
})

router.post('/test', upload.single('image'), (req, res) => {
    let data = req.body || {}
    console.log(data)
    data = JSON.parse(data.info)
    data.filesize = req.file.buffer.length
    console.log(data)
    res.send(data)
})

module.exports = router
