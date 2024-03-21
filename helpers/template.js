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

}

module.exports = {getPageTemplate, formatDomainList};