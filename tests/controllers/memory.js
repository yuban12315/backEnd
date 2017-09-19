let request = require("superagent")

let url = 'http://127.0.0.1:3000/memory'

request.post(url + '/testFile').attach("image", "homura.jpg").attach("image", "homura.jpg").end((error, response) => {
    if (error) console.log(error)
    if (response) console.log(response.text)
})
