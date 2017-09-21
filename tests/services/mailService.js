const mailService = require('./../../libs/services/mailService')

const data = {
    mailTo: 'misaka12315@gmail.com',
    vcode:'123456',
    type:'register'
}

mailService.sendMail(data,(err)=>{
    if (err) console.log(err)
})

// let a=`sdsd
//     `
// console.log(a)