let config = require('./../config'),
    storage = require('qiniu'),
    fs=require('fs')

class fileService {
    constructor() {
        storage.conf.ACCESS_KEY = config.qiniuConfig.ACCESS_KEY
        storage.conf.SECRET_KEY = config.qiniuConfig.SECRET_KEY

        //七牛空间地址
        this.bucket = 'project-eden'
    }

    upload(filename, callback) {
        this.uploadFile(filename, './uploads/' + filename, callback)
    }

    //内部方法
    uploadFile(key, file_path, callback) {
        this.key = key
        this.file_path = file_path
        let token = this.uptoken()
        //console.log(token)
        let extra = new storage.io.PutExtra()
        storage.io.putFile(token, this.key, this.file_path, extra, (err, res) => {
            if (err) {
                callback(err)
            }
            else {
                //上传完成后删除原图片
                this.deleteFile(file_path)
                //console.log(res.hash,res.key.res.persistentId)
                callback(null, res)
            }
        })
    }

    deleteFile(file_path){
        fs.unlink(file_path,(err)=>{
            if (err) throw err
        })
    }

    uptoken() {
        let put_policy = new storage.rs.PutPolicy(this.bucket + ":" + this.key)
        //put_policy.callbackUrl = 'http://ocxi5zst0.bkt.clouddn.com/callback.php'
        //put_policy.callbackBody = 'filename=$(fname)&filesize=$(fsize)'
        return put_policy.token()
    }


}

module.exports = new fileService()