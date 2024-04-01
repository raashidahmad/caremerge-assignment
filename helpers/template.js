let validations = require('./validators');
const cheerio = require('cheerio');
const axios = require('axios');
const RSVP = require('rsvp');
const { of, forkJoin, isObservable  } = require('rxjs');
//const { mergeMap, catchError } = require('rxjs/operators');


const NO_RESPONSE = 'NO RESPONSE';
const defaultHtml = `<title>${NO_RESPONSE}</title>`;

async function parseTitlesUsingAxios(domain) {
    try {
        if (!validations.validateDomainName(domain)) {
            return (`${domain} - ${NO_RESPONSE}`);
        } else {
            let result = await axios.get(domain).then((result) => {
                const $ = cheerio.load(result && result.data || defaultHtml);
                let pageTitle = $('title').text();

                if (pageTitle) {
                    return (`${domain} - ${pageTitle}`);
                } else {
                    return (`${domain} - ${NO_RESPONSE}`);
                }
            }).catch(err => {
                return (`${domain} - ${NO_RESPONSE}`);
            });
            return result;
        }
    } catch (error) {
        console.log(`Unable to connect with the server ${error.message}`);
        return (`${domain} - ${NO_RESPONSE}`, error.message);
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

async function parseTitlesUsingRSVP(domain) {
    try {
        if (!validations.validateDomainName(domain)) {
            return(`${domain} - ${NO_RESPONSE}`);
        } else {
            let response = await getAPromise(domain);
            if (response && response.data) {
                const $ = cheerio.load(response.data || defaultHtml);
                let pageTitle = $('title').text();

                if (pageTitle) {
                    return(`${domain} - ${pageTitle}`);
                } else {
                    return(`${domain} - ${NO_RESPONSE}`);
                }
            } else if(response && response.error) {
                return(`${domain} - ${NO_RESPONSE}`);
            };
        }
    } catch (error) {
        console.log(`Unable to connect with the server ${error.message}`);
        return(`${domain} - ${NO_RESPONSE}`);
    }
}

function parseTitlesUsingRxJs(domainsList, callback) {
    try {
        let results = [];
        const observables = domainsList.map(requestAsObservable);
        forkJoin(...observables).subscribe(
            responses => {
                responses.forEach((response, index) => {
                    if (isObservable(response)) {
                        response.subscribe(responseInfo => {
                            if (responseInfo.url && responseInfo.data) {
                                results.push(`${responseInfo.url} - ${NO_RESPONSE}`);
                            }
                        })
                    } else {
                        if (response && response.data) {
                            const $ = cheerio.load(response.data || defaultHtml);
                            let pageTitle = $('title').text();
        
                            if (pageTitle) {
                                results.push(`${domainsList[index]} - ${pageTitle}`);
                            } else {
                                results.push(`${domainsList[index]} - ${NO_RESPONSE}`);
                            }
                        } else {
                            console.log(response);
                        }
                    }
                });
                callback(results);
            },
            error => {
                results.push(`${error.url} - ${NO_RESPONSE}`);
                console.error('Error fetching data:', error);
            }
        );
    } catch (error) {
        console.log(`Unable to connect with the server ${error.message}`);
        return(`${domain} - ${NO_RESPONSE}`);
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
            resolve({
                url: url,
                data: response.data
            });
        })
            .catch(error => {
                reject({
                    url: url,
                    error: error
                });
            });
    });
}

function requestAsObservable(url) {
    return axios.get(url).catch(error => of({ url: url, data: NO_RESPONSE , error: error }));  
} 

module.exports = { parseTitlesUsingAxios, parseTitlesUsingFetch, parseTitlesUsingRSVP, parseTitlesUsingRxJs, parseTitlesForAsyncLib };