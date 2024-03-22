let validations = require('./validators');

function getPageTemplate(domainsStr) {
    return `
    <html>
    <head></head>
    <body>
     <h1> Following are the titles of given websites: </h1>
     <ul>
        ${domainsStr}
     </ul>
    </body>
    </html>
    `;
}

function formatDomainList(domains) {
    let domainStr = '';
    if (typeof(domains) === 'string') {
        if (!validations.validateDomainName(domains)) {
            domainStr = `<li>${domains} - NO RESPONSE</li>`;
        } else {
            domainStr = `<li>${domains}</li>`;
        }
    } else if (Array.isArray(domains)) {
        for(let i = 0; i < domains.length; i++) {
            domainStr += !validations.validateDomainName(domains[i]) ? `<li>${domains[i]} - NO RESPONSE</li>` : `<li>${domains[i]}</li>`;
            console.log(domainStr);
        }
    }
    return domainStr;
}

module.exports = {getPageTemplate, formatDomainList};