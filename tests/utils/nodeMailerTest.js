let mailer=require('nodemailer')
let config=require('./../../libs/config')

let transporter=mailer.createTransport({
    host:"smtp.qq.com",
    secureConnection:true,
    port:465,
    auth:config.mail
})

let sendMail=(html)=>{
    let option={
        from:config.mail.user,
        to:"17678031600@163.com",

        subject:"hello",
        html:html,
        text:html
    }
    transporter.sendMail(option,(error, response)=>{
        if(error){
            console.log("fail: " + error);
        }else{
            console.log("success: " + response.message);
        }})
}

sendMail("happy birthday")

