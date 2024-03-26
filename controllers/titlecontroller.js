const url = require('url');
const templateHelper = require('../helpers/template');

exports.getTitles = (req, res) => {
    const queryData = url.parse(req.url, true).query;
    
    let domains = '';
    if (queryData && queryData['address']) {
        domains = queryData['address'];
    }

    templateHelper.parseTitlesUsingRSVP(domains, async (titles, error) => {
        if (error === null) {
            console.log(titles);
            res.render('title', { titles, error });
        } else {
            res.render('title', { titles, error });
        }});
};