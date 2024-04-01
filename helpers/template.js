let validations = require('./validators');
const cheerio = require('cheerio');
const axios = require('axios');
const RSVP = require('rsvp');
const { Observable, from, throwError, pipe } = require('rxjs');
const { mergeMap, catchError } = require('rxjs/operators');


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
                        return(`${domain} - ${pageTitle}`, null);
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

/*async function getAPromise(url) {
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
}*/

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

function getAnObervable(url) {
    return new Observable((subject) => {
        axios.get(url)
            .then((response) => {
                subject.next({ url: url, data: response.data});
                subject.complete();
            })
            .catch((error) => {
                subject.error({url: url, error: error});
            });
    });
}

/*function parseTitlesUsingAxiosAndRxJs(domainsList, callback) {
    let results = [];
    const requests = from(domainsList);

    requests.pipe(
        mergeMap((url) => {
            return from(makeRequest(url));
        })
    ).subscribe((result) => {
        const $ = cheerio.load(result && result.data || defaultHtml);
        let pageTitle = $('title').text();

        if (pageTitle) {
            results.push(`${result.url} ${pageTitle}`);
        } else {
            results.push(`${result.url} ${NO_RESPONSE}`);
        }
    },
    (error) => {
      console.error(`Error occurred: ${error.message}`);
      results.push(`${error.url} - ${NO_RESPONSE}`);
    },
    () => {
      console.log('All requests completed.');
      callback(results, null);
    }
  );
}

async function makeRequest(url) {
    /*return axios.get(url).catch((e) => {
        let err = {
            url: url,
            error: e
        };
        return throwError(err);
    });

    let response  = await fetch(url);
    if (response.ok) {
        return {
            url: url,
            data: response.text()
        };
    } else {
        let err = {
            url: url,
            error: 'Error occurred'
        }
        return throwError(err);
    }
  };*/

module.exports = { parseTitlesUsingAxios, parseTitlesUsingFetch, parseTitlesUsingRSVP, parseTitlesUsingRxJs, parseTitlesForAsyncLib };