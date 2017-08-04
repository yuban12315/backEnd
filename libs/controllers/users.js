let express = require('express')
let mailer = require('./../services/mailService')
let uuid = require('uuid')
let router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource')
})

//获取验证码
router.post('/getVcode', (req, res) => {
    let mailAdress = req.body.mailTo || null
    if (mailAdress) {
        let vcode = uuid().toString.substring(0, 6)
        req.session.vcode = vcode

        mailer.sendMail({
            mailTo: mailAdress,
            vcode: vcode
        }, (err) => {
            if (err) {
                res.send({
                    status: false,
                    msg: err.message
                })
            } else {
                res.send({
                    status:true,
                    msg:'发送邮件成功'
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

module.exports = router;
