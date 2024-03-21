const express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    try {
        let obj = {
            "name": "test"
        };
        res.json(obj);
    } catch (err) {
        res.statusCode = 400;
        res.statusMessage = 'Something went wrong';
    }
});

module.exports = router;