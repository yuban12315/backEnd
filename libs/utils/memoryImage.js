
// let multer=require("multer"),
//     storage=multer.memoryStorage()
//
// let upload=multer({storage})
//
// module.exports=upload

const multer = require('multer'),
    uuid = require('uuid'),
    fs = require('fs'),
    storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, './uploads/') // 保存的路径，备注：需要自己创建
        },
        //给上传文件重命名
        filename: (req, file, cb) => {
            'use strict'
            const fileFormat = (file.originalname).split('.')
            if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.originalname)) {
                cb(new Error(`图片类型必须是.gif,jpeg,jpg,png中的一种,get:${fileFormat[1]}`))
            }
            else {
                const filename=uuid().toString()
                const newFileName = `memory${filename}.${fileFormat[1]}`
                cb(null, newFileName)
            }
        }
    }),
    upload = multer({storage})

module.exports = upload