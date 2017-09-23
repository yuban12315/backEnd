const fileService = require('../../libs/services/fileService'),
    console = require('tracer').console(),
    fs=require('await-fs')

// fileService.upLoadFile('test','test',(err,res)=>{
//     if(err) console.log(err)
//     if(res) console.log(res)
// })
console.log(fileService.generateName('ss'))

// const run = async () => {
//
//     try {
//         console.log(1)
//         //const a = await fileService.upload('test', 'test')
//         const file=await fs.readFile('homura.jpg')
//         await fileService.uploadFile('11223344.jpg',file)
//         console.log(file)
//
//         console.log(2)
//     } catch (err) {
//         console.log(err)
//     }
//
// }
// run()