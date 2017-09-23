const multer=require('multer')
const uuid=require('uuid')

const storage=multer.memoryStorage()
const upload=multer({storage})

module.exports=upload

/**
 * using memoryStorage instead of diskStorage
 * */