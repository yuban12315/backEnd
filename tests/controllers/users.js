const request = require('superagent')
const async = require('async')
const url = 'http://127.0.0.1:3000/users'

/**
 * 注册新用户*/

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
//cookie=[ 'connect.sid=s%3A41tN6fl8X9PHBOsgGTP-6IG6bW8MIQEA.bIkrH4C6pAbleorDnw6MBd0euNeudKbzU0kzIDM3gQU; Path=/; HttpOnly' ]
// async.waterfall([
//     //登录
//     // (callback) => {
//     //     request.post(`${url}/login`, {
//     //         email: '455678228@qq.com',
//     //         password: '123456'
//     //     }).end((err, res) => {
//     //         if (err) {
//     //             callback(err)
//     //         }
//     //         else {
//     //             cookie = res.header['set-cookie']
//     //             //console.log(cookie)
//     //             console.log(res.text)
//     //             callback(null)
//     //         }
//     //     })
//     // }
//
//     //获取资料
//     // (callback) => {
//     //     request.get(url + '/getProfile').set("Cookie", cookie).end((err, res) => {
//     //         if (err) {
//     //             callback(err)
//     //         }
//     //         else {
//     //             callback(null, res)
//     //         }
//     //     })
//     // }
//
//     //修改头像
//     // (callback)=>{
//     // request.post(url+'/resetAvatar').set("Cookie",cookie).field("name","avatar").attach('avatar','homura.jpg').end((err,res)=>{
//     //     callback(err,res)
//     //     })
//     // }
//
//     //修改资料
//     // (callback)=>{
//     //     request.post(url+'/resetProfile').set("Cookie",cookie).send({
//     //         nickname: "admin",
//     //         desc: "123456",
//     //         location: {
//     //             province:"四川",
//     //             city:"成都"
//     //         },
//     //         sex: "男"
//     //     }).end((error,res)=>{
//     //         if(res){
//     //             console.log(res.text)
//     //         }
//     //     })
//     // }
//
// ], (err, res) => {
//     if (err) console.log(err.message)
//     if (res) console.log(res.text)
// })

// let fs = require('fs')
// fs.readFile('homura.jpg', (error, buffer) => {
//     if (error) console.log(error)
//     console.log(buffer)
// })

request.post(`${url}/getVcode`,{mailTo:'1044842750@qq.com'}).end((error,res)=>{
    console.log(res.text)
})