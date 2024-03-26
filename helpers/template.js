let validations = require('./validators');
const { from } = require('rxjs');
const cheerio = require('cheerio');
const axios = require('axios');
const async = require('async');
const RSVP = require('rsvp');


const NO_RESPONSE = 'NO RESPONSE';
const defaultHtml = `<title>${NO_RESPONSE}</title>`;

async function parseTitlesUsingAxios(domains, callback) {
    try {
        let domainsList = typeof (domains) === 'string' ? [domains] : domains;
        let titles = [];

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

async function parseTitlesUsingRSVP(domains, callback) {
    let titles = [];
    try {
        let domainsList = typeof (domains) === 'string' ? [domains] : domains;
        for (let i = 0; i < domainsList.length; i++) {
            let result = getAPromise(domainsList[i]);
            result.then((html) => {
                const $ = cheerio.load(html || defaultHtml);
                    let pageTitle = $('title').text();

                    if (pageTitle) {
                        titles.push(`${domainsList[i]} - ${pageTitle}`);
                    } else {
                        titles.push(`${domainsList[i]} - ${NO_RESPONSE}`);
                    }

                    if (i === domainsList.length - 1) {
                        callback(titles);
                    }
            }).catch((error) => {
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

function getAPromise(url) {
    return new RSVP.Promise(async (resolve, reject) => {
        await axios.get(url).then((response) => {
            resolve(response.data);
        })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
}

module.exports = { parseTitlesUsingAxios, parseTitlesUsingFetch, parseTitlesUsingRSVP };