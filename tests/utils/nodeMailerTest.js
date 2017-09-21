const mailer=require('nodemailer')
const config=require('./../../libs/config')

const transporter=mailer.createTransport({
    host:'smtp.qq.com',
    secureConnection:true,
    port:465,
    auth:config.mail
})

const sendMail=(html)=>{
    const option={
        from:config.mail.user,
        to:'17678031600@163.com',

        subject:'hello',
        html,
        text:html
    }
    transporter.sendMail(option,(error, response)=>{
        if(error) {
            console.log(`fail: ${error}`)
        }else{
            console.log(`success: ${response.message}`)
        }})
}

sendMail('happy birthday')

