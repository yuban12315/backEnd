let express = require('express');
let router = express.Router();


router.get('/', function(req, res, next) {
    res.send("router about museums")
});

module.exports = router;
