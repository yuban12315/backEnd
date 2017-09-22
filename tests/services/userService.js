const userService = require('./../../libs/services/userService')
const console = require('tracer').console()

const test = async () => {
    try {
        const a = await userService.getAdress('127.0.0.1')
        console.log(a)
        console.log(a)
    } catch (err) {
        console.log(err)
    }
}
test()