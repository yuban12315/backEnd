let mailService = require('./../../libs/services/mailService')

let data = {
    mailTo: '100001qqcom',
    vcode:'12.456'
}

mailService.sendMail(data,(err)=>{
    if (err) console.log(err)
})