let userService=require('./../../libs/services/userService')

userService.getAddress('183.175.12.157',(err,res)=>{
    if (err)console.log(err)
    if (res)console.log(res)
})