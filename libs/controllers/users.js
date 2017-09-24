const express = require('express'),
    mailer = require('./../services/mailService'),
    userService = require('./../services/userService'),
    uuid = require('uuid/v1'),
    async = require('async'),
    userModel = require('./../dbs/models/userModel'),
    router = express.Router(),
    console = require('tracer').console(),
    upload = require('./../utils/avatarUpload'),
    fileService = require('../services/fileService_old')

router.get('/', function (req, res) {
    res.send(`respond with a resource:${req.ip}`)
})

//获取注册时验证码
router.post('/getVcode', async (req, res, next) => {
    try {
        const email = req.body.mailTo
        //检查邮箱是否已经被注册
        const doc = await userModel.findOne({email})
        if (doc != null) {
            throw new Error('邮箱已被使用')
        }
        const vcode = uuid().toString().substring(0, 6)
        req.session.vcode = vcode
        await mailer.sendMail({
            mailTo: email,
            vcode,
            type: 'register'
        })
        res.send({
            status: true,
            msg: '发送邮件成功'
        })
    } catch (error) {
        next(error)
    }
})

//注册
router.post('/register', async (req, res, next) => {
    try {
        const data = req.body || {}
        let status
        if (!data.hasOwnProperty('nickname')) {
            status = false
        }
        // else {
        //     if (data.nickname.length < 6) {
        //         status = false
        //     }
        // }
        if (!data.hasOwnProperty('password')) {
            status = false
        } else {
            if (data.password.length < 6) {
                status = false
            }
        }
        if (!data.hasOwnProperty('email')) {
            status = false
        } else {
            if (!mailer.checkMail(data.email)) {
                status = false
            }
        }
        if (!data.hasOwnProperty('vcode')) {
            status = false
        } else {
            if (data.vcode.length !== 6) {
                status = false
            }
        }
        if (!status) {
            throw new Error('未通过结构验证')
        }
        if (!req.session.vcode) {
            throw new Error('请先获取验证码')
        }
        if (data.vcode !== req.session.vcode) {
            throw new Error('验证码错误')
        }
        req.session.vcode = null
        data.location = await userService.getAdress(req.ip) //获取位置
        const salt = uuid().toString().substring(0, 8) //加密salt
        data._salt = salt
        data.password = userService.secret(data.password, salt)
        const user = new userModel(data)
        await user.save()
        res.send({
            status: true,
            msg: '注册成功'
        })
    } catch (error) {
        next(error)
    }
})

//登录
router.post('/login', async (req, res, next) => {
    //判断是否已经登录
    if (req.session.logged === true) {
        res.send({
            status: true,
            msg: '已经登录过了'
        })
    } else {
        const data = req.body || {}
        try {
            const doc = await userModel.findOne({email: data.email})
            if (doc === null) {
                throw new Error(`该用户不存在，email：${data.email || 'null'}`)
            }

            const password = userService.secret(data.password, doc._salt)
            if (doc.password !== password) {
                throw new Error('密码错误')
            }
            const location = userService.getAdress(req.ip)
            await userModel.update({email: data.email}, {$set: {location}})
            res.send({
                status: true,
                msg: '登录成功'
            })
        } catch (error) {
            next(error)
        }
    }
})

//获取登录状态
router.get('/checkLogin', (req, res) => {
    res.send({
        logged: !!req.session.logged
    })
})

//退出登录
router.get('/logout', (req, res) => {
    if (req.session.logged) {
        req.session.logged = false
    }
    res.send({
        status: true,
        msg: '退出登录成功'
    })
})

//获取重置密码时验证码
router.post('/getVcode2', async (req, res, next) => {
    try {
        const email = req.body.mailTo || null
        const doc = await userModel.findOne({email})
        if (doc === null) {
            throw new Error('用户邮箱不存在')
        }
        const vcode2 = uuid().toString().substring(0, 6)
        req.session.vcode2 = vcode2
        await mailer.sendMail({
            mailTo: email,
            vcode2,
            type: 'resetPassword'
        })
        res.send({
            status: true,
            msg: '发送邮件成功'
        })
    } catch (error) {
        next(error)
    }
})

//重置密码
router.post('/resetPassword', async (req, res, next) => {
    try {
        const data = req.body || {}
        let status = true
        if (!data.hasOwnProperty('email')) {
            status = false
        } else {
            if (!mailer.checkMail(data.email)) {
                status = false
            }
        }
        if (!data.hasOwnProperty('password')) {
            status = false
        } else {
            if (data.password.length < 6) {
                status = false
            }
        }
        if (!data.hasOwnProperty('vcode2')) {
            status = false
        } else {
            if (data.vcode2.length !== 6) {
                status = false
            }
        }
        if (!status) {
            throw new Error('未通过结构验证')
        }
        if (!req.session.vcode2) {
            throw new Error('请先获取验证码')
        }
        if (data.vcode2 !== req.session.vcode2) {
            throw new Error('验证码错误')
        }
        const doc = await userModel.findOne({email: data.email}, {_salt: '1'})
        const password = userService.secret(data.password, doc._salt)
        await userModel.update({email: data.email}, {$set: {password}})
        res.send({
            status: true,
            msg: '修改密码成功'
        })
    } catch (error) {
        next(error)
    }
})

//获取个人资料
router.get('/getProfile', async (req, res, next) => {
    try {
        const email = req.query.email | req.session.email
        const doc = await userModel.find({email},{
            email: 1,
            nickname: 1,
            sex: 1,
            desc: 1,
            location: 1,
            avatar: 1
        })
        if (doc === null) {
            throw new Error('无此用户')
        }
        res.send({
            status:true,
            msg: '返回个人资料',
            data: doc
        })
    } catch (error) {
        next(error)
    }
})

//重置个人资料
router.post('/resetProfile', (req, res) => {
    const data = req.body || {}
    //console.log(data)
    if (req.session.logged === true) {
        async.waterfall([
            (callback) => {
                let status = true
                if (!data.hasOwnProperty('nickname')) {
                    status = false
                }
                if (!data.hasOwnProperty('desc')) {
                    status = false
                }
                if (!data.hasOwnProperty('sex')) {
                    status = false
                }
                if (status) {
                    callback(null)
                } else {
                    callback(new Error('未通过结构验证'))
                }
            },
            (callback) => {
                userModel.update({email: req.session.email}, {
                    $set: {
                        nickname: data.nickname,
                        desc: data.desc,
                        sex: data.sex
                    }
                }).exec((err, doc) => {
                    if (err) {
                        callback(err)
                    }
                    else if (doc.nModified != 1) {
                        callback(new Error('修改昵称失败'))
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
                    msg: '修改资料成功'
                })
            }
        })
    } else {
        res.send({
            status: false,
            msg: '请先登录'
        })
    }
})

//修改头像
router.post('/resetAvatar', upload.single('avatar'), async (req, res, next) => {
    const data = req.body || {}
    try {
        const a = 1
    } catch (error) {
        next(error)
    }

    //console.log(data)
    // if (req.session.logged === true) {
    //     //console.log(req.file.buffer)
    //     async.waterfall([
    //         //头像文件上传七牛云
    //         (callback) => {
    //             const filename = req.file.filename
    //             //console.log(filename)
    //             if (!filename) {
    //                 callback(new Error('未获取到文件'))
    //             } else {
    //                 fileService.upload(filename, (error, response) => {
    //                     if (error) {
    //                         callback(error)
    //                     }
    //                     else {
    //                         //console.log(response)
    //                         callback(null, response.key)
    //                     }
    //                 })
    //             }
    //         },
    //         //修改的头像存数据库
    //         (avatar, callback) => {
    //             userModel.update({email: req.session.email}, {
    //                 $set: {avatar: `http://ocxi5zst0.bkt.clouddn.com/${avatar}`}
    //             }).exec((err, doc) => {
    //                 if (err) {
    //                     callback(err)
    //                 }
    //                 else if (doc.nModified != 1) {
    //                     callback(new Error('修改头像失败'))
    //                 }
    //                 else {
    //                     callback(null, avatar)
    //                 }
    //             })
    //         }
    //     ], (err, avatar) => {
    //         if (err) {
    //             res.send({
    //                 status: false,
    //                 msg: err.message
    //             })
    //         }
    //         else {
    //             res.send({
    //                 status: true,
    //                 msg: '修改头像成功',
    //                 avatar
    //             })
    //         }
    //     })
    // } else {
    //     res.send({
    //         status: false,
    //         msg: '请先登录'
    //     })
    // }
})

//test 文件测试路径
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

module.exports = router