let validations = require('./validators');
const cheerio = require('cheerio');
const axios = require('axios');
const RSVP = require('rsvp');
const { Observable } = require('rxjs');


const NO_RESPONSE = 'NO RESPONSE';
const defaultHtml = `<title>${NO_RESPONSE}</title>`;

async function parseTitlesUsingAxios(domain, callback) {
    try {
        if (!validations.validateDomainName(domain)) {
            callback(`${domain} - ${NO_RESPONSE}`);
        } else {
            await axios.get(domain).then((result) => {
                const $ = cheerio.load(result && result.data || defaultHtml);
                let pageTitle = $('title').text();

                if (pageTitle) {
                    callback(`${domain} - ${pageTitle}`, null);
                } else {
                    callback(`${domain} - ${NO_RESPONSE}`, null);
                }
            }).catch(err => {
                callback(`${domain} - ${NO_RESPONSE}`);
            });
        }
    } catch (error) {
        callback(`${domain} - ${NO_RESPONSE}`, error.message);
        console.log(`Unable to connect with the server ${error.message}`);
    }
}

async function parseTitlesUsingFetch(domain, callback) {
    try {
        if (!validations.validateDomainName(domain)) {
            callback(`${domain} - ${NO_RESPONSE}`);
        } else {
            await fetch(domain)
                .then((response) => response.text())
                .then((html) => {
                    const $ = cheerio.load(html || defaultHtml);
                    let pageTitle = $('title').text();

                    if (pageTitle) {
                        callback(`${domain} - ${pageTitle}`, null);
                    } else {
                        callback(`${domain} - ${NO_RESPONSE}`, null);
                    }
                })
                .catch((error) => {
                    callback(`${domain} - ${NO_RESPONSE}`);
                });
        }
    } catch (error) {
        callback(`${domain} - ${NO_RESPONSE}`, error.message);
        console.log(`Unable to connect with the server ${error.message}`);
    }
}

async function parseTitlesUsingRSVP(domain, callback) {
    try {
        if (!validations.validateDomainName(domain)) {
            callback(`${domain} - ${NO_RESPONSE}`);
        } else {
            let result = getAPromise(domain);
            result.then((html) => {
                const $ = cheerio.load(html || defaultHtml);
                let pageTitle = $('title').text();

                if (pageTitle) {
                    callback(`${domain} - ${pageTitle}`, null);
                } else {
                    callback(`${domain} - ${NO_RESPONSE}`, null);
                }
            }).catch((error) => {
                callback(`${domain} - ${NO_RESPONSE}`);
            });
        }
    } catch (error) {
        callback(`${domain} - ${NO_RESPONSE}`, error.message);
        console.log(`Unable to connect with the server ${error.message}`);
    }
}

function parseTitlesUsingRxJs(domain, callback) {
    try {
        if (!validations.validateDomainName(domain)) {
            callback(`${domain} - ${NO_RESPONSE}`);
        } else {
            let observable = getAnObervable(domain);
            observable.subscribe({
                next: html => {
                    const $ = cheerio.load(html || defaultHtml);
                    let pageTitle = $('title').text();

                    if (pageTitle) {
                        callback(`${domain} - ${pageTitle}`, null);
                    } else {
                        callback(`${domain} - ${NO_RESPONSE}`, null);
                    }
                },
                error: error => {
                    callback(`${domain} - ${NO_RESPONSE}`);
                }
            });
        }
    } catch (error) {
        callback(`${domain} - ${NO_RESPONSE}`, error.message);
        console.log(`Unable to connect with the server ${error.message}`);
    }
}

async function parseTitlesForAsyncLib(domain) {
    try {
        if (!validations.validateDomainName(domain)) {
            return `${domain} - ${NO_RESPONSE}`;
        } else {
            let response = await fetch(domain);
            if (response.ok) {
                let result = await response.text();
                const $ = cheerio.load(result || defaultHtml);
                let pageTitle = $('title').text();
    
                if (pageTitle) {
                    return `${domain} - ${pageTitle}`;
                } else {
                    return `${domain} - ${NO_RESPONSE}`;
                }
            } else {
                return `${domain} - ${NO_RESPONSE}`;
            }
        }
    } catch (error) {
        console.log(`Unable to connect with the server ${error.message}`);
        return `${domain} - ${NO_RESPONSE}`;
    }
}

function getAPromise(url) {
    return new RSVP.Promise(async (resolve, reject) => {
        await axios.get(url).then((response) => {
            resolve(response.data);
        })
            .catch(error => {
                reject(error);
            });
    });
}

function getAnObervable(url) {
    return new Observable((subject) => {
        axios.get(url)
            .then((response) => {
                subject.next(response.data);
                subject.complete();
            })
            .catch((error) => {
                subject.error(error);
            });
    });
}

module.exports = { parseTitlesUsingAxios, parseTitlesUsingFetch, parseTitlesUsingRSVP, parseTitlesUsingRxJs, parseTitlesForAsyncLib };