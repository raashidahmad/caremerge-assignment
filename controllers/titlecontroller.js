const url = require('url');
const templateHelper = require('../helpers/template');
const implementations = require('../helpers/constants');
const async = require('async');
const { combineLatest, forkJoin } = require('rxjs');

exports.getTitles = (req, res) => {
    const queryData = url.parse(req.url, true).query;

    let domains = '';
    if (queryData && queryData['address']) {
        domains = queryData['address'];
    }

    const implementationTypes = implementations.asyncImplementations;

    //Please comment, and uncomment to see each implementation
    //let currentType = implementationTypes.RXJS;
    //let currentType = implementationTypes.RSVP;
    let currentType = implementationTypes.FETCH;
    //let currentType = implementationTypes.AXIOS;
    //let currentType = implementationTypes.ASYNC_LIB;

    let titles = [];
    let requests = [];
    let domainsList = typeof (domains) === 'string' ? [domains] : domains;
    let errorMessage = '';

    switch (currentType) {

        case implementationTypes.AXIOS:
            for (let d = 0; d < domainsList.length; d++) {
                requests.push(templateHelper.parseTitlesUsingAxios(domainsList[d]));
            }

            combineLatest(requests).subscribe({
                next: titles => {
                    res.render('title', { titles, errorMessage });
                },
                error: error => {
                    errorMessage = error;
                    res.render('title', { titles, errorMessage });
                }
            });
            break;

        case implementationTypes.FETCH:
            for (let d = 0; d < domainsList.length; d++) {
                templateHelper.parseTitlesUsingFetch(domainsList[d], (fetchedTitle, error) => {
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
                requests.push(templateHelper.parseTitlesUsingRSVP(domainsList[d]));
            }

            forkJoin(requests).subscribe({
                next: titles => {
                    res.render('title', { titles, errorMessage });
                },
                error: error => {
                    errorMessage = error;
                    res.render('title', { titles, errorMessage });
                }
            });
            break;

        case implementationTypes.RXJS:
            templateHelper.parseTitlesUsingRxJs(domainsList, (titles) => {
                res.render('title', { titles, errorMessage });
            });
            break;

        case implementationTypes.ASYNC_LIB:
            async.mapLimit(domainsList, domainsList.length, templateHelper.parseTitlesForAsyncLib, (err, titles) => {
                res.render('title', { titles, errorMessage });
            });
            break;
    }
};