console.log(data)
if (req.session.logged === true) {
    //console.log(req.file.buffer)
    async.waterfall([
        //头像文件上传七牛云
        (callback) => {
            const filename = req.file.filename
            //console.log(filename)
            if (!filename) {
                callback(new Error('未获取到文件'))
            } else {
                fileService.upload(filename, (error, response) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        //console.log(response)
                        callback(null, response.key)
                    }
                })
            }
        },
        //修改的头像存数据库
        (avatar, callback) => {
            userModel.update({email: req.session.email}, {
                $set: {avatar: `http://ocxi5zst0.bkt.clouddn.com/${avatar}`}
            }).exec((err, doc) => {
                if (err) {
                    callback(err)
                }
                else if (doc.nModified != 1) {
                    callback(new Error('修改头像失败'))
                }
                else {
                    callback(null, avatar)
                }
            })
        }
    ], (err, avatar) => {
        if (err) {
            res.send({
                status: false,
                msg: err.message
            })
        }
        else {
            res.send({
                status: true,
                msg: '修改头像成功',
                avatar
            })
        }
    })
} else {
    res.send({
        status: false,
        msg: '请先登录'
    })
}