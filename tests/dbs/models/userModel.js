const userModel = require('./../../../libs/dbs/models/userModel')
const console = require('tracer').console()
const uuid=require('uuid/v1')
const md5 = require('crypto').createHash('md5')

// userModel.findOne({email:'panjiahui@imudges.com'},{"email":"1"}).exec((err, docs) => {
//     console.log(docs)
//     if (err) {
//         console.log(err)
//     } else if (docs===null) {
//         console.log('邮箱已被使用')
//     }
//     else {
//         console.log("qwe")
//     }
// })
const salt=uuid().toString().substring(0,8)
let password='123456'
password=md5.update(password+salt).digest('hex')
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

const user=new userModel({
    nickname:'admin',
    password,
    email:'455678228@qq.com',
    desc:'null',
    location:{
        province:'内蒙古',
        city:'呼和浩特'
    },
    _salt:salt
})
user.save((err,docs)=>{
    if (err)console.log(err)
    if (docs)console.log(docs)
})