class MyError {
    static TypeError(msg) {
        const error=new TypeError(msg)
        // error.status=403
        return error
    }
}

module.exports = MyError