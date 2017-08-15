let express = require('express')
let mailer = require('./../services/mailService')
let uuid = require('uuid/v1')
let async = require('async')
let md5 = require('crypto').createHash('md5')
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
    //console.log(req.body)
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
                    vcode: vcode,
                    type: 'register'
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
    let data = req.body || {}
    async.waterfall([
        //检查data结构
        (callback) => {
            let status = true
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
            if (!req.session.vcode) {
                callback(new Error("请先获取验证码"))
            }
            else if (data.vcode != req.session.vcode) {
                callback(new Error("验证码错误"))
            }
            else {
                callback(null)
            }
        },
        //检查邮箱是否被占用
        (callback) => {
            userModel.findOne({email: data.email}).exec((err, docs) => {
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
            data._salt = uuid().toString().substring(0, 8)
            data.password=md5.update(data.password+data._salt).digest('hex');
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
    if (req.session.logged == true) {
        res.send({
            status: true,
            msg: "已经登录过"
        })
    } else {
        let data = req.body || {}
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
                    callback(new Error("未通过结构验证"))
                }
            },
            //登录
            (callback) => {
                userModel.findOne({email: data.email}).exec((err, docs) => {
                    data.password=md5.update(data.password).digest('hex');
                    if (err) {
                        callback(err)
                    }
                    else {
                        if (docs == null) {
                            callback(new Error("用户不存在"))
                        } else if (docs.password != data.password) {
                            callback(new Error("密码错误"))
                        }
                        else {
                            callback(null)
                        }
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
                //console.log(req.session.email + ' ' + req.session.logged)
                res.send({
                    status: true,
                    msg: "登录成功"
                })
            }
        })
    }

})
//获取登录状态
router.get('checkLogin', (req, res) => {
    res.send({
        logged: !!req.session.logged
    })
})
//退出登录*
router.get('/logout', (req, res) => {
    if (req.session.logged) {
        req.session.logged = false
    }
    res.send({
        status: true,
        msg: "退出登录成功"
    })
})
//获取重置密码时验证码
router.post('/getVcode2', (req, res) => {
    let mailAdress = req.body.mailTo || null
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
                let vcode = uuid().toString().substring(0, 6)
                //验证码存入session
                req.session.vcode2 = vcode
                mailer.sendMail({
                    mailTo: mailAdress,
                    vcode: vcode,
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
//重置密码
router.post('/resetPassword', (req, res) => {
    let data = req.body || {}
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
        //检查验证码
        (callback) => {
            if (!req.session.vcode2) {
                callback(new Error("请先获取验证码"))
            }
            else if (data.vcode2 != req.session.vcode2) {
                callback(new Error("验证码错误"))
            }
            else {
                userModel.findOne({email:data.email},{"_salt":"1"}).exec((err,docs)=>{
                    if (err){
                        callback(err)
                    }
                    else {
                        callback(null,docs._salt)
                    }
                })
            }
        },
        //修改数据库内密码
        (_salt,callback) => {
            let password=md5.update(data.password+_salt).digest('hex');
            userModel.update({email:data.email},{$set:{password:password}}).exec((err,doc)=>{
                if (err){
                    callback(err)
                }
                else if (doc.nModified!=1){
                    callback(new Error("修改密码失败"))
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
                msg: "修改密码成功"
            })
        }
    })
})



module.exports = router