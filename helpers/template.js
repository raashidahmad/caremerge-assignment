let validations = require('./validators');

function getPageTemplate(domains, callback) {
    try {
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
            }
        }
        //Using timeout only to simulate the db call or a file read
        setTimeout(() => {
            let template = `
                    <html>
                    <head></head>
                    <body>
                    <h1> Following are the titles of given websites: </h1>
                    <ul> 
                        ${domainStr}
                    </ul>
                    </body>
                    </html>
                    `;
            callback(template, null);
        }, 1000);
    } catch(e) {
        callback('', e);
    } 
}

module.exports = {getPageTemplate, formatDomainList};