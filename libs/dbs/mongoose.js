const mongoose=require('mongoose')
const config=require('./../config')

const opt={
    user: config.user,
    pass: config.pass,
    auth: {
        authdb: config.db
    }
}

mongoose.Promise = Promise
mongoose.connect(config.dbUrl,{useMongoClient: true})
module.exports=mongoose
