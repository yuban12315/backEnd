const userService = require('./../../libs/services/userService')
const console = require('tracer').console()

const test = async () => {
    try {
        let a = await userService.getAdress('183.175.12.157')
        console.log(a)
    } catch (err) {
        console.log(err)
    }
}
test()