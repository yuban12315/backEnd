const config = require('./../config'),
    storage = require('qiniu'),
    fs = require('fs')

class fileService {
    constructor() {
        storage.conf.ACCESS_KEY = config.qiniuConfig.ACCESS_KEY
        storage.conf.SECRET_KEY = config.qiniuConfig.SECRET_KEY

        //七牛空间地址
        this.bucket = 'project-eden'
    }

    upload(filename, callback) {
        this.uploadFile_old(filename, `./uploads/${filename}`, callback)
    }

    //内部方法
    uploadFile_old(key, file_path) {
        this.key = key
        this.file_path = file_path
        const token = this.uptoken()
        //console.log(token)
        const extra = new storage.io.PutExtra()
        // storage.io.putFile(token, this.key, this.file_path, extra, (err, res) => {
        //     if (err) {
        //         callback(err)
        //     }
        //     else {
        //         //上传完成后删除原图片
        //         this.deleteFile(file_path)
        //         //console.log(res.hash,res.key.res.persistentId)
        //         callback(null, res)
        //     }
        // })
    }

    async uploadFile(key, file_path) {
        this.key = key
        this.file_path = file_path
        const token = this.uptoken()
        const extra = new storage.io.PutExtra()
        // storage.io.putFile(token, this.key, this.file_path, extra, (err, res) => {
        //     if (err) {
        //         callback(err)
        //     }
        //     else {
        //         //上传完成后删除原图片
        //         this.deleteFile(file_path)
        //         //console.log(res.hash,res.key.res.persistentId)
        //         callback(null, res)
        //     }
        // })
        let res
        await storage.io.putFile(token, this.key, this.file_path, extra,(error, response)=>{
            console.log(3)
            if (error) throw error
            else res = response
        })
        console.log(res)
        //this.deleteFile(file_path)
    }

    deleteFile(file_path) {
        fs.unlink(file_path, (err) => {
            if (err) throw err
        })
    }

    uptoken() {
        const put_policy = new storage.rs.PutPolicy(`${this.bucket}:${this.key}`)
        //put_policy.callbackUrl = 'http://ocxi5zst0.bkt.clouddn.com/callback.php'
        //put_policy.callbackBody = 'filename=$(fname)&filesize=$(fsize)'
        return put_policy.token()
    }

}

module.exports = new fileService()