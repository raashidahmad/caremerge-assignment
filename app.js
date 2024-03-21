const express = require('express');
const app = express();
const url = require('url');
const http = require('http');
const templateHelper = require('./helpers/template')

//The middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
//End of middleware

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    const queryData = url.parse(req.url, true).query;
    if (queryData && queryData['address']) {
        console.log(queryData['address']);
    }

    if (req.url.includes('/I/want/title')) {
        // Set the content type to HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        
        let template = templateHelper.getPageTemplate();
        res.end(template);
    } else {
        // Handle other routes or 404
        res.writeHead(404);
        res.end();
    }

    //app.use('/', require('./controllers/titlecontroller'));
}).listen(PORT, () => {
    console.log(`Server started using the port ${PORT}`);
});



/*app.listen(PORT, () => {
    console.log(`Server started using the port ${PORT}`);
});*/