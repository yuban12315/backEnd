const express = require('express')
const router = express.Router()
const userSerive=require('./../services/userService')

/* GET home page. */

router.get('/',  async function (req, res) {
    res.send('index')
})


module.exports = router
