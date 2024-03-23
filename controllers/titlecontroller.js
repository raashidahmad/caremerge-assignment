const url = require('url');
const templateHelper = require('../helpers/template');

exports.getTitles = (req, res) => {
    const queryData = url.parse(req.url, true).query;
    const pathname = url.parse(req.url, true).pathname;
    let domains = '';
    if (queryData && queryData['address']) {
        domains = queryData['address'];
    }

    let domainsList = templateHelper.parseDomainsForView(domains);
    res.render('title', { domainsList });// Render an HTML view
};