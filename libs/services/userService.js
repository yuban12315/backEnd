let async = require('async')
let request = require('superagent-charset')(require('superagent'))
let crypto=require('crypto')

class userService {
    constructor() {

    }

    getAddress(ip, callback) {
        /*默认返回服务器地址*/
        request.get("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=" + ip).charset('utf-8').end((err, res) => {
            if (err || !res.hasOwnProperty('text')) {
                callback(err)
            } else {
                let data=JSON.parse(res.text.substring(res.text.indexOf('{'),res.text.indexOf(';')))
                data={
                    country:data.country,
                    province:data.province,
                    city:data.city
                }
                callback(null,data)
            }
        })
        let testString = `var remote_ip_info = {"ret":1,"start":-1,"end":-1,"country":"\u4e2d\u56fd","province":"\u5185\u8499\u53e4","city":"\u547c\u548c\u6d69\u7279","district":"","isp":"","type":"","desc":""};`

        testString = testString.substring(testString.indexOf('{'), testString.indexOf(';'))

    }

    secret(password,salt){
        //docs.password != md5.update(data.password + docs._salt).digest('hex')
        let md5 = crypto.createHash('md5')
        let t=md5.update(password+salt)
        return md5.digest('hex')
    }
}

module.exports = new userService()