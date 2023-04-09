const fetch = require('node-fetch');

fetch('/questions', {
    headers: {
        'Authorization': `bearer ${accessToken}`
    }
})