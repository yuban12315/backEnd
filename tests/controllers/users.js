let request=require('superagent')

// request.post('http://127.0.0.1:3000/users/getVcode2',{
//     mailTo:'misaka12315@gmail.com'
// }).end((err,res)=>{
//     if (err)console.log(err)
//     if (res&&res.hasOwnProperty('text')){
//         console.log(res.text)
//     }
// })

// request.get('http://127.0.0.1:3000/users/logout').end((err,res)=>{
//     if (err){console.log(err)}
//     if (res){console.log(res.text)}
// })

// request.post("http://127.0.0.1:3000/users/login",{
//     email:"455678228@qq.com",password:"123456"
// }).end((err,res)=>{
//     if (err){console.log(err)}
//     if (res){console.log(res.text)}
// })

// let reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
// let mail='1044842750@hr.com'
// console.assert(reg.test(mail),'dsds')
let crypto=require('crypto')
let md5=crypto.createHash('md5')
md5.update('q1q')
console.log(md5.digest('hex'))