let mailer=require('nodemailer')
let config=require('./../libs/config')

let transporter=mailer.createTransport({
    host:"smtp.163.com",
    secureConnection:true,
    port:1,
    auth:config.mail
})

