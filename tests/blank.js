async.waterfall([
    (callback) => {
        const email = req.query.email || req.session.email
        userModel.findOne({email}, {
            email: 1,
            nickname: 1,
            sex: 1,
            desc: 1,
            location: 1,
            avatar: 1
        }).exec((error, doc) => {
            if (error) {
                callback(error)
            }
            else if (doc === null) {
                callback(new Error('无此用户'))
            }
            else callback(null, doc)
        })
    }
], (err, result) => {
    if (err) {
        res.send({
            status: false,
            msg: err.message
        })
    }
    else {
        res.send({
            status: true,
            msg: '返回个人资料',
            data: result
        })
    }
})