let mailService = require('./../../libs/services/mailService')

let data = {
    mailTo: 'kanglongqq1@163.com',
    vcode:'12.456'
}

mailService.sendMail(data)