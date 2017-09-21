const async = require('async')
const request = require('superagent-charset')(require('superagent'))
const crypto = require('crypto')
const console = require('tracer').console()

class userService {
    constructor() {

    }

    //获取地址(async版)
    getAddress_old(ip, callback) {
        /*默认返回服务器地址*/
        request.get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=${ip}`).charset('utf-8').end((err, res) => {
            if (err || !res.hasOwnProperty('text')) {
                callback(err)
            } else {
                const text = res.text.substring(res.text.indexOf('{'), res.text.indexOf(';'))
                //console.log(text)
                if (text.includes('{')) {
                    let data = JSON.parse(text)
                    data = {
                        province: data.province,
                        city: data.city
                    }
                    callback(null, data)
                }
                else {
                    callback(new Error('获取地址失败'))
                }
            }
        })
        // let testString = `var remote_ip_info = {"ret":1,"start":-1,"end":-1,"country":"\u4e2d\u56fd","province":"\u5185\u8499\u53e4","city":"\u547c\u548c\u6d69\u7279","district":"","isp":"","type":"","desc":""};`
        //
        // testString = testString.substring(testString.indexOf('{'), testString.indexOf(';'))

    }

    //获取地址(es6版)
    static async getAdress(ip) {
        let res = await request.get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=${ip}`).charset('utf-8')
        //console.log(res)
        if (!res.text) throw new Error('连接新浪地址服务器失败')
        const text = res.text.substring(res.text.indexOf('{'), res.text.indexOf(';'))
        if (!text.includes('{')) {
            return new Error(`获取地址信息失败，失败ip${ip}`)
        }
        let data = JSON.parse(text)
        data = {
            province: data.province,
            city: data.city
        }
        return data
    }

    //加密
    static secret(password, salt) {
        //docs.password != md5.update(data.password + docs._salt).digest('hex')
        const md5 = crypto.createHash('md5')
        const t = md5.update(password + salt)
        return md5.digest('hex')
    }
}

module.exports = userService