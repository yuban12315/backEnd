const memoryModel = require('./../../../libs/dbs/models/memoryModel')
const mongoose = require('mongoose')
const data = {
    desc: '天泽夕映&紫河半夏，电五斗转星移',
    owner: mongoose.Types.ObjectId('59b61a07ef570c285097dfb6'),
    time: new Date().getTime(),
    photos: [
        {
            url: 'http://ocxi5zst0.bkt.clouddn.com/2017-08-09_20-50-02-000.jpg',
            name: '1',
            index: 0
        }, {
            url: 'http://ocxi5zst0.bkt.clouddn.com/2017-08-09_20-51-27-000.jpg',
            name: '2',
            index: 1
        }, {
            url: 'http://ocxi5zst0.bkt.clouddn.com/2017-08-09_20-55-13-000.jpg',
            name: '3',
            index: 2
        }
    ],
    published: true,
    museumID: mongoose.Types.ObjectId('59c77a1a502a8a3bd018af0b'),
    display: 1
}
const run = async () => {
    //const memory=new memoryModel(data)
    //let res=await memory.save()
    let data=await memoryModel.find({museumID:mongoose.Types.ObjectId('59c77a1a502a8a3bd018af0b')})

    console.log(data)
}
run()