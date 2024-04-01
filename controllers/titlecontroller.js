const url = require('url');
const templateHelper = require('../helpers/template');
const implementations = require('../helpers/constants');
const async = require('async');
const { combineLatest } = require('rxjs');

exports.getTitles = (req, res) => {
    const queryData = url.parse(req.url, true).query;

    let domains = '';
    if (queryData && queryData['address']) {
        domains = queryData['address'];
    }

    const implementationTypes = implementations.asyncImplementations;

    //Please comment, and uncomment to see the each implementation
    //let currentType = implementationTypes.RXJS;
    //let currentType = implementationTypes.RSVP;
    //let currentType = implementationTypes.FETCH;
    //let currentType = implementationTypes.AXIOS;
    let currentType = implementationTypes.ASYNC_LIB;

    let titles = [];
    let domainsList = typeof (domains) === 'string' ? [domains] : domains;
    let errorMessage = '';

    /*switch (currentType) {

        case implementationTypes.AXIOS:
            for (let d = 0; d < domainsList.length; d++) {
                templateHelper.parseTitlesUsingAxios(domainsList[d], async (fetchedTitle, error) => {
                    titles.push(fetchedTitle);
                    if (error && error.message) {
                        errorMessage = error.message;
                    }
                    if (titles.length === domainsList.length) {
                        res.render('title', { titles, errorMessage });
                    }
                });
            }
            break;

        case implementationTypes.FETCH:
            for (let d = 0; d < domainsList.length; d++) {
                templateHelper.parseTitlesUsingFetch(domainsList[d], async (fetchedTitle, error) => {
                    titles.push(fetchedTitle);
                    if (error && error.message) {
                        errorMessage = error.message;
                    }
                    if (titles.length === domainsList.length) {
                        res.render('title', { titles, errorMessage });
                    }
                });
            }
            break;

        case implementationTypes.RSVP:
            for (let d = 0; d < domainsList.length; d++) {
                templateHelper.parseTitlesUsingRSVP(domainsList[d], async (fetchedTitle, error) => {
                    titles.push(fetchedTitle);
                    if (error && error.message) {
                        errorMessage = error.message;
                    }

                    if (titles.length === domainsList.length) {
                        res.render('title', { titles, errorMessage });
                    }
                });
            }
            break;

        case implementationTypes.RXJS:
            for (let d = 0; d < domainsList.length; d++) {
                templateHelper.parseTitlesUsingRxJs(domainsList[d], async (fetchedTitle, error) => {
                    titles.push(fetchedTitle);
                    if (error && error.message) {
                        errorMessage = error.message;
                    }

                    if (titles.length === domainsList.length) {
                        res.render('title', { titles, errorMessage });
                    }
                });
            }
            break;

        case implementationTypes.ASYNC_LIB:
            async.mapLimit(domainsList, domainsList.length, templateHelper.parseTitlesForAsyncLib, (err, titles) => {
                if (err) {
                    console.log(`Error occurred: ${err.message}`);
                }
                res.render('title', { titles, errorMessage });
            });
            break;
    }*/

    let requests = [];
    for (let d = 0; d < domainsList.length; d++) {
        requests.push(templateHelper.parseTitlesUsingAxios(domainsList[d]));
    }

    combineLatest(requests).subscribe({
        next: titles => {
            res.render('title', { titles, errorMessage });
        },
        error: error => {
            //res.render('title', { titles, errorMessage });
        }
    }
       
    );
};