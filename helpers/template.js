function getPageTemplate(domainsStr) {
    return `
    <html>
    <head></head>
    <body>
     <h1> Following are the titles of given websites: </h1>
     <ul>

     </ul>
    </body>
    </html>
    `;
}

function formatDomainList(domains) {
    let domainStr = '';
    if (typeof(domains) === 'object') {
        return `<li>${domains}</li>`;
    } else if (Array.isArray(domains)) {
        let domainsStr = '';
        domains.forEach((domain) => {
            domainsStr.concat(`<li>${domain}</li>`);
        });
        return domainsStr;
    }
}

module.exports = {getPageTemplate, formatDomainList};