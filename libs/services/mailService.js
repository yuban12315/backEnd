let config=require('./../config')
let mailer=require('nodemailer')

class mailService {

    constructor() {
        this._transporter=mailer.createTransport({
            host:"smtp.qq.com",
            secureConnection:true,
            port:465,
            auth:config.mail
        })
    }

    sendMail(data,callback){
        if (!callback){
            callback=()=>{}
        }

        let opt={
            from:config.mail.user,
            to:data.mailTo,

            subject:'register vcode',
            text:`${data.vcode}`
        }

        this._transporter.sendMail(opt,(err,res)=>{
            /*if (err){
                console.log(err)
            }
            else {
                console.log(res)
            }*/
            callback(err, res)
        })
    }



}

module.exports=new mailService()