let userService=require('./../../libs/services/userService')

userService.getAddress('127.0.0.1',(err,res)=>{
    if (err)console.log(err)
    if (res)console.log(res)
})