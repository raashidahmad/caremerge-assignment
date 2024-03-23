const express = require('express');
const app = express();
const url = require('url');
const http = require('http');
const templateHelper = require('./helpers/template');
const async = require('async');
const implementations = require('./helpers/constants');

//The middleware
/*
We are not handling CORS, but just for the sake of learning writing this piece
*/
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
        const pathname = url.parse(req.url, true).pathname;
        
        let domains = '';
        if (queryData && queryData['address']) {
            domains = queryData['address'];
        }

        if (pathname === '/I/want/title/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            const implementationTypes = implementations.asyncImplementations;
            /*
            Please comment, and uncomment to see the each implementation
            */
            let currentType = implementationTypes.RXJS;
            //let currentType = implementationTypes.PROMISES;
            //let currentType = implementationTypes.ASYNC_LIB;
            //let currentType = implementationTypes.SIMPLE_CALLBACK;

            switch(currentType) {
                
                case implementationTypes.SIMPLE_CALLBACK:
                     //simple call using a call back
                    templateHelper.getPageTemplate(domains, async(template, error) => {
                        if (error === null) {
                            res.end(template);
                        } else {
                            res.writeHead(500, `Internal Server Error ${error && error.message || null}`);
                            res.end();
                        }
                    });
                    break;

                case implementationTypes.ASYNC_LIB:
                    //Call using async lib
                    /*
                    I could add multiple function here in the series to be executed in the sequence
                    For example, the first function will parse the domains, and second will return the
                    template. Avoided that only to keep one template helper for all the implementations
                    */
                    async.series([next => templateHelper.getPageTemplate(domains, (template, error) => {
                        if (error === null) {
                            res.end(template);
                        } else {
                            res.writeHead(500, `Internal Server Error ${error && error.message || null}`);
                            res.end();
                        }
                    })], (error, results) => {
                        if (error) {
                            res.writeHead(500, `Internal Server Error ${error && error.message || null}`);
                            res.end();
                        }
                    });
                    break;

                case implementationTypes.PROMISES:
                    //Call to get a promise result
                    templateHelper.getPageTemplateUsingPromise(domains)
                    .then((template) => {
                        res.end(template);
                    }).catch((error) => {
                        res.writeHead(500, `Internal Server Error ${error && error.message || null}`);
                        res.end();
                    });
                    break;

                case implementationTypes.RXJS:
                    //Call to the template using RxJs Observables
                    /*
                    I could implement the subscribe here, but in order to keep the consistency between the
                    implementations, implemented the subscribe in the helper file and used a call back
                    for returning the response
                    */
                    templateHelper.getPageTemplateUsingRxJs(domains, (template, error) => {
                        if (error === null) {
                            res.end(template);
                        } else {
                            res.writeHead(500, `Internal Server Error ${error && error.message || null}`);
                            res.end();
                        }
                    });
                    break;
            }
             
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