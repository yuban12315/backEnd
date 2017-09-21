const request = require('superagent')

const url = 'http://123.207.157.229:3000/memory'
//
// request.post(url + '/testFile').attach("image", "homura.jpg").attach("image", "12.png").end((error, response) => {
//     if (error) console.log(error)
//     if (response) console.log(response.text)
// })

request.get(`${url}/nearBy`).end((error, res)=>{
    if (error)console.log(error)
    if (res) {
        console.log(res.text)
    }
})
