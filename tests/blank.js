const data = req.body || {}
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
            callback(new Error('未通过结构验证'))
        }
    },
    //检查验证码是否正确
    (callback) => {
        if (!req.session.vcode) {
            callback(new Error('请先获取验证码'))
        }
        else if (data.vcode != req.session.vcode) {
            callback(new Error('验证码错误'))
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
                callback(new Error('邮箱已被占用'))
            }
            //未被占用
            else {
                callback(null)
            }
        })
    },
    //获取位置
    (callback) => {
        userService.getAddress_old(req.ip, (err, loc) => {
            if (err) {
                callback(err)
            }
            else {
                callback(null, loc)
            }
        })
    },
    //用户信息存入数据库
    (location, callback) => {
        data._salt = uuid().toString().substring(0, 8)
        data.location = location
        data.password = userService.secret(data.password, data._salt)
        const user = new userModel(data)
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
            msg: '注册成功'
        })
    }
})