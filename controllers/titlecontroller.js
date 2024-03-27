const url = require('url');
const templateHelper = require('../helpers/template');
const implementations = require('../helpers/constants');

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
    let currentType = implementationTypes.AXIOS;

    let titles = [];
    let domainsList = typeof (domains) === 'string' ? [domains] : domains;
    let errorMessage = '';

    switch (currentType) {

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
    }

};