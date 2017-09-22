const config = require('./../config'),
    qiniu = require('qiniu'),
    fs = require('fs')

//使用内存数据传输
class fileService {
    constructor() {
        const ACCESS_KEY = config.qiniuConfig.ACCESS_KEY
        const SECRET_KEY = config.qiniuConfig.SECRET_KEY

        //七牛空间地址
        this.bucket = 'project-eden'

        this.mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)

    }

    uptoken() {
        const put_policy = new storage.rs.PutPolicy(`${this.bucket}:${this.key}`)
        return put_policy.token()
    }
}

module.exports = new fileService()