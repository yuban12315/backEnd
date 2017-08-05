let userModel = require('./../../../libs/dbs/models/userModel')
let console = require('tracer').console()

// userModel.find({email: "1044842750@qq.com"}).exec((err, docs) => {
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

// let user=new userModel({
//     username:"admin1",
//     password:"123456",
//     email:"455678228@qq.com"
// })
// user.save((err,docs)=>{
//     if (err)console.log(err)
//     if (docs)console.log(docs)
// })