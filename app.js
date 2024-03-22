const express = require('express');
const app = express();
const url = require('url');
const http = require('http');
const templateHelper = require('./helpers/template');
const async = require('async');

//The middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//End of middleware

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    try {
        const queryData = url.parse(req.url, true).query;
        let domains = '';
        if (queryData && queryData['address']) {
            domains = queryData['address'];
        }

        if (req.url.includes('/I/want/title')) {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            //simple call using a call back
            /*templateHelper.getPageTemplate(domains, async(template, error) => {
                if (error === null) {
                    res.end(template);
                } else {
                    res.writeHead(500, `Internal Server Error ${error || && error && error.message || null}`);
                    res.end();
                }
            });*/

            //Call using async lib
            /*async.series([next => templateHelper.getPageTemplate(domains, (template, error) => {
                if (error === null) {
                    res.end(template);
                } else {
                    res.writeHead(500, `Internal Server Error ${error || && error && error.message || null}`);
                    res.end();
                }
            })], (error, results) => {
                if (error) {
                    res.writeHead(500, `Internal Server Error ${error || error && error.message || null}`);
                    res.end();
                }
            });*/

            //Call to get a promise result
            templateHelper.getPageTemplateUsingPromise(domains)
                .then((template) => {
                    res.end(template);
                }).catch((error) => {
                    res.writeHead(500, `Internal Server Error ${error || error && error.message || null}`);
                    res.end();
                })
        } else {
            res.writeHead(404, `Not Found`);
            res.end();
        }
    } catch (e) {
        res.writeHead(500, `Internal Server Error ${e && e.message || null}`);
        res.end();
    }
}).listen(PORT, () => {
    console.log(`Server started using the port ${PORT}`);
});