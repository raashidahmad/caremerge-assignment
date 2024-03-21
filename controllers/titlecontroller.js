const express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log('Request executed');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // Write your HTML directly as the response
        res.end("<div><p>Hello HTML</p></div>");
    } catch (err) {
        res.writeHead(404);
        res.end();
    }
});
module.exports = router;