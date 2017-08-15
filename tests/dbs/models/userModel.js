let userModel = require('./../../../libs/dbs/models/userModel')
let console = require('tracer').console()
let uuid=require('uuid/v1')
let md5 = require('crypto').createHash('md5')

// userModel.findOne({email:'panjiahui@imudges.com'},{"email":"1"}).exec((err, docs) => {
//     console.log(docs)
//     if (err) {
//         console.log(err)
//     } else if (docs.length > 0) {
//         console.log('邮箱已被使用')
//     }
//     else {
//         console.log("qwe")
//     }
// })
// let salt=uuid().toString().substring(0,8)
//
// password=md5.update(password+salt).digest('hex');
// userModel.update({email:email},{$set:{
//     password:password,
//     _salt:salt
// }},(err,docs)=>{
//     if (err){
//         console.log(err)
//     }
//     if (docs){
//         console.log(docs)
//     }
// })

// let user=new userModel({
//     username:"admin1",
//     password:"123456",
//     email:"455678228@qq.com"
// })
// user.save((err,docs)=>{
//     if (err)console.log(err)
//     if (docs)console.log(docs)
// })