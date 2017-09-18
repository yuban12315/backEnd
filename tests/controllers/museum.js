let request=require("superagent")

let url = 'http://127.0.0.1:3000/museum'

// 创建museum (√)
let data={
    location:{
        city:"呼和浩特",
        province:"内蒙古"
    },
    name:"测试博物馆",
    desc:"测试描述：1234567890，qwertyuiopasdfghjklzxcvbnm",
    startTime:new Date().getTime(),
    filename:"image"
}

let strObj=JSON.stringify(data)
console.log(data.startTime)
console.log(strObj)
request.post(url+'/create').field("info",strObj).attach("image","12.png").end((error, res)=>{
    if (error){
        console.log(error)
    }
    if (res){
        console.log(res.text)
    }
})

//返回附近museum
// request.get(url+'/nearBy').end((error,res)=>{
//     console.log(res.text)
// })

