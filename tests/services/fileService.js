const fileService=require('./../../libs/services/fileService')

fileService.upLoadFile('test','test',(err,res)=>{
    if(err) console.log(err)
    if(res) console.log(res)
})