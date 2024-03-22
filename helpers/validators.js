function validateDomainName(domain) {
    // No credits, taken from Internet
    const regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

    if (regex.test(domain)) {
        return true; 
    } else {
        return false; 
    }
}

module.exports = {validateDomainName};