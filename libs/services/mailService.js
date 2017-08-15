let config = require('./../config')
let mailer = require('nodemailer')

class mailService {

    constructor() {
        this._transporter = mailer.createTransport({
            host: "smtp.qq.com",
            secureConnection: true,
            port: 465,
            auth: config.mail
        })
    }

    /**发送邮件
     * 传入邮件地址和生成的验证码*/
    sendMail(data, callback) {
        if (!callback) {
            callback = () => {
            }
        }

        let opt = {
            from: config.mail.user,
            to: data.mailTo,
            //subject: `[MemoryLibrary]${data.type}`,
            //text: `<h1>[MemoryLibrary]</h1><br/><h2>验证码：<b>${data.vcode}</b></h2><br/>`
        }

        if (data.type == 'register') {
            opt.subject='[MemoryLibrary]注册验证码'
            opt.html = `<h1>[MemoryLibrary]</h1><br/>
                              <p>尊敬的用户：<br/>
                              您的邮箱 <i>${data.mailTo}</i> 正在申请注册MemoryLibrary账号。<br/>
                              <h3>注册验证码：<b>${data.vcode}</b></h3><br/>
                              感谢您注册MemoryLibrary帐号，请在10分钟内完成注册。工作人员不会向您索取验证码，请勿泄露。<br/>
                              消息来自：MemoryLibrary安全中心
                              </p> `
        }
        else if (data.type == 'resetPassword') {
            opt.subject='[MemoryLibrary]重置密码'
            opt.html = `<h1>[MemoryLibrary]</h1><br/>
                              <p>尊敬的用户：<br/>
                              您的账号邮箱 <i>${data.mailTo}</i> 正在申请重置密码。<br/>
                              <h3>重置密码验证码：<b>${data.vcode}</b></h3><br/>
                              感谢您使用MemoryLibrary帐号，请在10分钟内完成重置密码操作。工作人员不会向您索取验证码，请勿泄露。<br/>
                              消息来自：MemoryLibrary安全中心
                              </p> `
        }

        this._transporter.sendMail(opt, (err, res) => {
            /*if (err){
             console.log(err)
             }
             else {
             console.log(res)
             }*/
            callback(err, res)
        })
    }

    checkMail(mail){
        let t=mail||''
        return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(t)
    }


}

module.exports = new mailService()