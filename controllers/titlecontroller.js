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
    let currentType = implementationTypes.RXJS;
    //let currentType = implementationTypes.RSVP;
    //let currentType = implementationTypes.FETCH;
    //let currentType = implementationTypes.AXIOS;

    switch (currentType) {

        case implementationTypes.AXIOS:
            templateHelper.parseTitlesUsingAxios(domains, async (titles, error) => {
                if (error === null) {
                    console.log(titles);
                    res.render('title', { titles, error });
                } else {
                    res.render('title', { titles, error });
                }
            });
            break;

        case implementationTypes.FETCH:
            templateHelper.parseTitlesUsingFetch(domains, async (titles, error) => {
                if (error === null) {
                    console.log(titles);
                    res.render('title', { titles, error });
                } else {
                    res.render('title', { titles, error });
                }
            });
            break;

        case implementationTypes.RSVP:
            templateHelper.parseTitlesUsingRSVP(domains, async (titles, error) => {
                if (error === null) {
                    console.log(titles);
                    res.render('title', { titles, error });
                } else {
                    res.render('title', { titles, error });
                }
            });
            break;

        case implementationTypes.RXJS:
            templateHelper.parseTitlesUsingRxJs(domains, async (titles, error) => {
                if (error === null) {
                    console.log(titles);
                    res.render('title', { titles, error });
                } else {
                    res.render('title', { titles, error });
                }
            });
            break;
    }

};