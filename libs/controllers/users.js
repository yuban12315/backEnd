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

    } catch (error) {
        next(error)
    }
})

//登录
router.post('/login', (req, res) => {
    //判断是否已经登录
    if (req.session.logged == true) {
        res.send({
            status: true,
            msg: '已经登录过'
        })
    } else {
        const data = req.body || {}
        //console.log(data)
        async.waterfall([
            //检查data结构
            (callback) => {
                let status = true
                if (!data.hasOwnProperty('email')) {
                    status = false
                } else {
                    if (data.email.length < 6) {
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
                if (status) {
                    callback(null)
                } else {
                    callback(new Error('未通过结构验证'))
                }
            },
            //获取地址
            (callback) => {
                userService.getAddress_old(req.ip, (error, response) => callback(error, response))
            },
            //登录
            (location, callback) => {
                userModel.findOne({email: data.email}).exec((err, docs) => {
                    if (err) {
                        callback(err)
                    }
                    else {
                        if (docs === null) {
                            callback(new Error('用户不存在'))
                        } else {
                            const password = userService.secret(data.password, docs._salt)
                            if (password !== docs.password) {
                                callback(new Error('密码错误'))
                            }
                            else {
                                callback(null, location)
                            }
                            //data.password = md5.update(data.password).digest('hex');
                        }
                    }
                })
            },
            //修改地址
            (location, callback) => {
                userModel.update({email: data.email}, {
                    $set: {
                        location: {
                            city: location.city,
                            province: location.province
                        }
                    }
                }).exec((error) => callback(error))
            }
        ], (err) => {
            if (err) {
                res.send({
                    status: false,
                    msg: err.message
                })
            } else {
                req.session.logged = true
                req.session.email = data.email
                //console.log(req.session.email + ' ' + req.session.logged)
                res.send({
                    status: true,
                    msg: '登录成功'
                })
            }
        })
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
router.post('/getVcode2', (req, res) => {
    const mailAdress = req.body.mailTo || null
    if (mailAdress) {
        async.waterfall([
            //检查邮箱是否是注册邮箱
            (callback) => {
                userModel.findOne({email: mailAdress}).exec((err, docs) => {
                    if (err) {
                        callback(err)
                    } else if (docs == null) {
                        callback(new Error('用户邮箱不存在'))
                    }
                    else {
                        callback(null)
                    }
                })
            },
            //发送邮件
            (callback) => {
                //生成验证码
                const vcode = uuid().toString().substring(0, 6)
                //验证码存入session
                req.session.vcode2 = vcode
                mailer.sendMail({
                    mailTo: mailAdress,
                    vcode,
                    type: 'resetPassword'
                }, (err) => {
                    //出现错误
                    if (err) {
                        callback(err)
                    }
                    //发送成功
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
                    msg: '发送邮件成功'
                })
            }
        })
    }
    //未发送邮件
    else {
        res.send({
            status: false,
            msg: '邮箱地址缺省'
        })
    }
})

//重置密码
router.post('/resetPassword', (req, res) => {
    const data = req.body || {}
    async.waterfall([
        //检查data结构
        (callback) => {
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
                if (data.vcode2.length != 6) {
                    status = false
                }
            }
            if (status) {
                callback(null)
            } else {
                callback(new Error('未通过结构验证'))
            }
        },
        //检查验证码
        (callback) => {
            if (!req.session.vcode2) {
                callback(new Error('请先获取验证码'))
            }
            else if (data.vcode2 != req.session.vcode2) {
                callback(new Error('验证码错误'))
            }
            else {
                userModel.findOne({email: data.email}, {_salt: '1'}).exec((err, docs) => {
                    if (err) {
                        callback(err)
                    }
                    else {
                        callback(null, docs._salt)
                    }
                })
            }
        },
        //修改数据库内密码
        (_salt, callback) => {
            const password = userService.secret(data.password, _salt)
            userModel.update({email: data.email}, {$set: {password}}).exec((err, doc) => {
                if (err) {
                    callback(err)
                }
                else if (doc.nModified != 1) {
                    callback(new Error('修改密码失败'))
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
                msg: '修改密码成功'
            })
        }
    })
})

//获取个人资料
router.get('/getProfile', (req, res) => {
    async.waterfall([
        (callback) => {
            const email = req.query.email || req.session.email
            userModel.findOne({email}, {
                email: 1,
                nickname: 1,
                sex: 1,
                desc: 1,
                location: 1,
                avatar: 1
            }).exec((error, doc) => {
                if (error) {
                    callback(error)
                }
                else if (doc === null) {
                    callback(new Error('无此用户'))
                }
                else callback(null, doc)
            })
        }
    ], (err, result) => {
        if (err) {
            res.send({
                status: false,
                msg: err.message
            })
        }
        else {
            res.send({
                status: true,
                msg: '返回个人资料',
                data: result
            })
        }
    })
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