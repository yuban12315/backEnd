const fileService = require('../../libs/services/fileService_old'),
    console=require('tracer').console()

// fileService.upLoadFile('test','test',(err,res)=>{
//     if(err) console.log(err)
//     if(res) console.log(res)
// })

const run = async () => {
    try {
        console.log(1)
       let a= await fileService.uploadFile('test', 'test')
        console.log(2)
        console.log(a)
    }catch (err){
        console.log(err)
    }

}
run()