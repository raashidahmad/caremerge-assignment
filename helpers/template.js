let validations = require('./validators');
const { from } = require('rxjs');

function getPageTemplate(domains, callback) {
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
        if (!validations.validateDomainName(domains)) {
            domainStr = `<li>${domains} - NO RESPONSE</li>`;
        } else {
            domainStr = `<li>${domains}</li>`;
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

module.exports = { getPageTemplate, getPageTemplateUsingPromise, getPageTemplateUsingRxJs };