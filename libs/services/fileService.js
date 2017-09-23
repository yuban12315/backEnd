const config = require('./../config'),
    qiniu = require('qiniu'),
    fs = require('fs'),
    uuid = require('uuid/v1')

/**使用内存数据传输
 * qiniu version:7.08
 * */
class fileService {
    constructor() {
        this.ACCESS_KEY = config.qiniuConfig.ACCESS_KEY
        this.SECRET_KEY = config.qiniuConfig.SECRET_KEY

        //七牛空间地址
        this.bucket = 'project-eden'
        this.mac = new qiniu.auth.digest.Mac(this.ACCESS_KEY, this.SECRET_KEY)

        this.config = new qiniu.conf.Config()
        this.config.zone = qiniu.zone.Zone_z0

    }

    getUpToken() {
        //token设置
        const opt = {
            scope: this.bucket,//云空间
            returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'//返回格式
        }
        const putPolicy = new qiniu.rs.PutPolicy(opt)
        return putPolicy.uploadToken(this.mac)
    }

    async upload(file, key) {
        if (!file) {
            throw new Error('未获取到文件')
        }
        let filename = file.originalname

        const fileFormat = (filename).split('.')
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filename)) {
            throw new Error(`图片类型必须是.gif,jpeg,jpg,png中的一种,当前:${fileFormat[1]}`)
        }
        filename = `${this.generateName(key)}.${fileFormat[1]}`
        return await this.uploadFile(filename, file.buffer)
    }

    //use memoryStore
    async uploadFile(filename, data) {
        return new Promise((resolve, reject) => {
            const token = this.getUpToken()
            const putExtra = new qiniu.form_up.PutExtra()
            const uploader = new qiniu.form_up.FormUploader
            uploader.put(token, filename, data, putExtra, (error, resBody, resInfo) => {
                if (error) {
                    reject(error)
                }
                // console.log(resBody)
                resolve(resBody)
            })
        })
    }

    generateName(key) {
        const id = uuid().toString()
        return `${key}:${id}`
    }
}

module.exports = new fileService()
