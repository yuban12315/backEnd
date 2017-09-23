const config = require('./../config')
const mailer = require('nodemailer')

class mailService {

    constructor() {
        this._transporter = mailer.createTransport({
            host: 'smtp.qq.com',
            secureConnection: true,
            port: 465,
            auth: config.mail
        })
    }

    /**发送邮件
     * 传入邮件地址和生成的验证码*/
    async sendMail(data) {
        return new Promise((resolve, reject) => {
            const opt = {
                from: config.mail.user,
                to: data.mailTo
            }
            //根据不同的类型发送内容不同的邮件
            if (data.type === 'register') {
                opt.subject = '[MemoryLibrary]注册验证码'
                opt.html = `<h1>[MemoryLibrary]</h1><br/>
                              <p>尊敬的用户：<br/>
                              您的邮箱 <i>${data.mailTo}</i> 正在申请注册MemoryLibrary账号。<br/>
                              <h3>注册验证码：<b>${data.vcode}</b></h3><br/>
                              感谢您注册MemoryLibrary帐号，请在10分钟内完成注册。工作人员不会向您索取验证码，请勿泄露。<br/>
                              消息来自：MemoryLibrary安全中心
                              </p> `
            }
            else if (data.type === 'resetPassword') {
                opt.subject = '[MemoryLibrary]重置密码'
                opt.html = `<h1>[MemoryLibrary]</h1><br/>
                              <p>尊敬的用户：<br/>
                              您的账号邮箱 <i>${data.mailTo}</i> 正在申请重置密码。<br/>
                              <h3>重置密码验证码：<b>${data.vcode}</b></h3><br/>
                              感谢您使用MemoryLibrary帐号，请在10分钟内完成重置密码操作。工作人员不会向您索取验证码，请勿泄露。<br/>
                              消息来自：MemoryLibrary安全中心
                              </p> `
            }

            //发送邮件
            this._transporter.sendMail(opt, (error, res) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(res)
                }
            })
        })
    }

    checkMail(mail) {
        const t = mail || ''
        return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(t)
    }

}

module.exports = new mailService()