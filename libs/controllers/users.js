let express = require('express')
let mailer = require('./../services/mailService')
let uuid = require('uuid/v1')
let async = require('async')
let userModel = require('./../dbs/models/userModel')
let router = express.Router()
let console = require('tracer').console()

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource')
})
//获取注册时验证码
router.post('/getVcode', (req, res) => {
    let mailAdress = req.body.mailTo || null
    if (mailAdress) {
        async.waterfall([
            //检查邮箱是否已经被注册
            (callback) => {
                userModel.findOne({email: mailAdress}).exec((err, docs) => {
                    if (err) {
                        callback(err)
                    } else if (docs != null) {
                        callback(new Error('邮箱已被使用'))
                    }
                    else {
                        callback(null)
                    }
                })
            },
            //发送邮件
            (callback) => {
                //生成验证码
                let vcode = uuid().toString().substring(0, 6)
                //验证码存入session
                req.session.vcode = vcode
                mailer.sendMail({
                    mailTo: mailAdress,
                    vcode: vcode
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
                    msg: "发送邮件成功"
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
//注册
router.post('/register', (req, res) => {
    async.waterfall([
        //检查data结构
        (callback) => {
            let data = req.body || {}
            let status = true
            if (!data.hasOwnProperty('username')) {
                status = false
            } else {
                if (data.username.length <= 6) {
                    status = false
                }
            }
            if (!data.hasOwnProperty('password')) {
                status = false
            } else {
                if (data.password.length <= 6) {
                    status = false
                }
            }
            if (!data.hasOwnProperty('email')) {
                status = false
            }
            if (!data.hasOwnProperty('vcode')) {
                status = false
            } else {
                if (data.vcode.length != 6) {
                    status = false
                }
            }
            if (status) {
                callback(null)
            } else {
                callback(new Error("未通过结构验证"))
            }
        },
        //检查验证码是否正确
        (callback) => {
            if (data.vcode != req.session.vcode) {
                callback(new Error("验证码错误"))
            }
            else {
                callback(null)
            }
        },
        //检查用户名是否被占用
        (callback) => {
            userModel.findOne({username: data.username}).exec((err, docs) => {
                if (err) {
                    callback(err)
                } else if (docs != null) {
                    callback(new Error("邮箱已被占用"))
                }
                //未被占用
                else {
                    callback(null)
                }
            })
        },
        //用户信息存入数据库
        (callback) => {
            let user = new userModel(data)
            user.save((err, docs) => {
                if (err) {
                    callback(err)
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
                msg: "注册成功"
            })
        }
    })
})
//登录
router.post('/login', (req, res) => {
    //判断是否已经登录
    if (req.session.logged = true) {
        res.send({
            status: true,
            msg: "已经登录过"
        })
    } else {
        async.waterfall([
            //检查data结构
            (callback) => {
                let status = true
                if (!data.hasOwnProperty('username')) {
                    status = false
                } else {
                    if (data.username.length <= 6) {
                        status = false
                    }
                }
                if (!data.hasOwnProperty('password')) {
                    status = false
                } else {
                    if (data.password.length <= 6) {
                        status = false
                    }
                }
                if (status) {
                    callback(null)
                } else {
                    callback(new Error("未通过结构验证"))
                }
            },
            //登录
            (callback) => {
                userModel.findOne({username: data.username}).exec((err, docs) => {
                    if (err) {
                        callback(err)
                    }
                    else {

                    }
                })
            }
        ], (err) => {
            if (err) {
                res.send({
                    status: false,
                    msg: err.message
                })
            } else {
                req.session.logged = true
                req.session.username = data.username
                console.log(req.session.username + ' ' + req.session.logged)
                res.send({
                    status: true,
                    msg: "登录成功"
                })
            }
        })
    }

})
//获取重置密码时验证码
router.post('getVcode2', (req, res) => {
    async.waterfall([])
})
//重置密码


module.exports = router;
