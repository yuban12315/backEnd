const request = require('superagent')

const url = 'http://127.0.0.1:3000/museum',
    async = require('async'),
    console = require('tracer').console()

// 创建museum (√)
// const data = {
//     location: {
//         city: '包头',
//         province: '内蒙古'
//     },
//     name: '测试博物馆',
//     desc: '测试描述：1234567890，qwertyuiopasdfghjklzxcvbnm',
//     startTime: new Date().getTime(),
//     filename: 'image'
// }
//
// const strObj = JSON.stringify(data)
// request.post(`${url}/create`)..end((error, res) => {
//     if (error) {
//         console.log(error)
//     }
//
//     if (res) {
//         console.log(res.text)
//     }
// })

//返回附近museum
// request.get(url + '/nearBy').end((error, res) => {
//     if (error) console.log(error)
//     if (res) {
//         let data = JSON.parse(res.text)
//         async.map(data.data,(i,callback)=>{
//             console.log(i)
//             request.get(url+'/detail?id='+i._id).end((error,res)=>{
//                 if (error)callback(error)
//                 else {
//                     callback(null,res)
//                 }
//             })
//         }, (error, docs) => {
//             if (error) console.log(error)
//             if (docs) console.log(docs)
//         })
//     }
// })
//

//detail test
// request.get(`${url}/detail?id=59bf879bdf0fd03ce8414f59`).end((error, res) => {
//     if (error) console.log(error)
//     else {
//         console.log(res.text)
//     }
// })

// request.post(`${url}/update`).attach('image','homura.jpg').end((error, res)=>{
//     console.log(res.text)
// })

const data = {
    location: {
        city: '包头',
        province: '内蒙古'
    },
    name: '测试博物馆',
    desc: '测试描述：1234567890，qwertyuiopasdfghjklzxcvbnm',
    startTime: new Date().getTime(),
    filename: 'image'
}

const strObj = JSON.stringify(data)
request.post(`${url}/create`).field('info',strObj).attach('image','homura.jpg').end((error, res)=>{
    console.log(res.text)
})