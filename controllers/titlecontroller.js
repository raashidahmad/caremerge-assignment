const url = require('url');
const templateHelper = require('../helpers/template');

exports.getTitles = (req, res) => {
    const queryData = url.parse(req.url, true).query;
    
    let domains = '';
    if (queryData && queryData['address']) {
        domains = queryData['address'];
    }

    templateHelper.parseDomainsForView(domains, async (domainsList, error) => {
        if (error === null) {
            res.render('title', { domainsList, error });
        } else {
            res.render('title', { domainsList, error });
        }});
};