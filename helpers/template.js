let validations = require('./validators');
const { from } = require('rxjs');
const cheerio = require('cheerio');
const axios = require('axios');
const async = require('async');


const NO_RESPONSE = 'NO RESPONSE';
const defaultHtml = `<title>${NO_RESPONSE}</title>`;

/*function getPageTemplate(domains, callback) {
    try {
        let template = createTemplate(domains);
        //Using timeout only to simulate the db call or a file read
        setTimeout(() => {
            callback(template, null);
        }, 1000);
    } catch (e) {
        callback('', e);
    }
}

function getPageTemplateUsingPromise(domains) {
    return new Promise((resolve, reject) => {
      let template = createTemplate(domains);
    
      if (template) {
        resolve(template); 
      } else {
        reject(new Error('Failed to create the template')); 
      }
    });
}

function getPageTemplateUsingRxJs(domains, callback) {
    let template = createTemplate(domains);
    let observable = from([template]);

    observable.subscribe({
        next: data => {
            callback(data, null);
        },
        error: error => {
            callback('', error);
        }
    });
}

function createTemplate(domains) {
    let domainStr = '';
    if (typeof (domains) === 'string') {
        if (domains.length === 0) {
            domainStr = `<li>No domain name/s provided - NO RESPONSE</li>`;
        } else {
            if (!validations.validateDomainName(domains)) {
                domainStr = `<li>${domains} - NO RESPONSE</li>`;
            } else {
                domainStr = `<li>${domains}</li>`;
            }
        }
    } else if (Array.isArray(domains)) {
        for (let i = 0; i < domains.length; i++) {
            domainStr += !validations.validateDomainName(domains[i]) ? `<li>${domains[i]} - NO RESPONSE</li>` : `<li>${domains[i]}</li>`;
        }
    }

    return `<html>
            <head></head>
            <body>
            <h1> Following are the titles of given websites: </h1>
            <ul> 
                ${domainStr}
            </ul>
            </body>
            </html>`;
}

function parseDomainsForView(domains, callback) {
    let domainsList = [];
    if (typeof (domains) === 'string') {
        if (domains.length === 0) {
            domainsList.push("No domain name/s provided - NO RESPONSE");
            const error = {
                message: 'Invalid domain name provided'
            }
            callback(domainsList, error);
        } else {
            if (!validations.validateDomainName(domains)) {
                domainsList.push(`${domains} - NO RESPONSE`);
            } else {
                domainsList.push(domains);
            }
        }
        callback(domainsList, null);
    } else if (Array.isArray(domains)) {
        for (let i = 0; i < domains.length; i++) {
             if (!validations.validateDomainName(domains[i])) {
                domainsList.push(`${domains[i]} - NO RESPONSE`);
             } else {
                domainsList.push(domains[i]);
             }
        }
        callback(domainsList, null);
    } 
}*/

async function parseTitlesUsingAxios(domains, callback) {
    try {
        let domainsList = typeof (domains) === 'string' ? [domains] : domains;
        let titles = [];
        let index = 0;

        for (let i = 0; i < domainsList.length; i++) {
            index = i;
            await axios.get(domainsList[i]).then((result) => {
                const $ = cheerio.load(result && result.data || defaultHtml);
                let pageTitle = $('title').text();

                if (pageTitle) {
                    titles.push(`${domainsList[i]} - ${pageTitle}`);
                } else {
                    titles.push(`${domainsList[i]} - ${NO_RESPONSE}`);
                }

                if (i === domainsList.length - 1) {
                    callback(titles);
                }
            }).catch(err => {
                titles.push(`${domainsList[titles.length - 1]} - ${NO_RESPONSE}`);
                if (titles.length === domainsList.length) {
                    callback(titles);
                }
            });
        }
    } catch (error) {
        titles.push(`${domainsList[titles.length]} - ${NO_RESPONSE}`);
        if (titles.length === domainsList.length) {
            callback(titles);
        }
        console.error('Error fetching data:', error);
    }
}

async function parseTitlesUsingFetch(domains, callback) {
    let titles = [];

    try {
        let domainsList = typeof (domains) === 'string' ? [domains] : domains;
        for (let i = 0; i < domainsList.length; i++) {

            await fetch(domainsList[i])
                .then((response) => response.text())
                .then((html) => {
                    const $ = cheerio.load(html || defaultHtml);
                    let pageTitle = $('title').text();

                    if (pageTitle) {
                        titles.push(`${domainsList[i]} - ${pageTitle}`);
                    } else {
                        titles.push(`${domainsList[i]} - ${NO_RESPONSE}`);
                    }

                    if (i === domainsList.length - 1) {
                        console.log(`All are executed ${i}`);
                        callback(titles);
                    }
                })
                .catch((error) => {
                    titles.push(`${domainsList[titles.length]} - ${NO_RESPONSE}`);
                    if (titles.length === domainsList.length) {
                        callback(titles);
                    }
                });
        }
    } catch (error) {
        console.log(`Unable to connect with the server ${error.message}`);
    }
}
module.exports = { parseTitlesUsingAxios, parseTitlesUsingFetch };