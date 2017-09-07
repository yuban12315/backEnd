let request = require('superagent')
let async = require('async')
let url = 'http://127.0.0.1:3000/users'

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
// let crypto=require('crypto')
// let md5=crypto.createHash('md5')
// md5.update('q1q')
// console.log(md5.digest('hex'))

// async.waterfall([
//     (callback) => {
//         console.log(1)
//         request.post(url + '/login', {
//             email: "455678228@qq.com",
//             password: "123456"
//         }).end((err) => callback(err))
//     },
//     (callback) => {
//         console.log(2)
//         request.post(url+'/resetNickname',{
//             nickename:"admin1"
//         }).end((err,res)=>callback(err,res))
//     }
// ], (err, res) => {
//     if (err) console.log(err)
//     if (res) console.log(res.text)
// })
// request.post(url + '/resetNickname', {
//     nickname: "admin1"
// }).end((err, res) => {
//     if (err) console.log(err)
//     if (res) console.log(res.text)
// })
let cookie
// cookie=[ 'connect.sid=s%3AT2W0x84KlRQodrd-aPyEvm0ie_nVPcLb.XJGHSQWHv2j8JS2FdRvXkAb9R557A759fTAgv4Exm6M; Path=/; HttpOnly' ]
async.waterfall([
    //登录
    (callback) => {
        request.post(url + '/login', {
            email: "455678228@qq.com",
            password: "123456"
        }).end((err, res) => {
            if (err) {
                callback(err)
            }
            else {
                cookie = res.header["set-cookie"]
                console.log(cookie)
                console.log(res.text)
                callback(null)
            }
        })
    },
    //获取资料
    // (callback) => {
    //     request.get(url + '/getProfile').set("Cookie", cookie).end((err, res) => {
    //         if (err) {
    //             callback(err)
    //         }
    //         else {
    //             callback(null, res.text)
    //         }
    //     })
    // }
], (err, res) => {
    if (err) console.log(err.message)
    if (res) console.log(res)
})