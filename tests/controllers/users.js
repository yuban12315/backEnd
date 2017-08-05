let request=require('superagent')

request.post('http://127.0.0.1:3000/users/getVcode',{
    mailTo:'kanglongqq1@163.com'
}).end((err,res)=>{
    if (err)console.log(err)
    if (res&&res.hasOwnProperty('text')){
        console.log(res.text)
    }
})