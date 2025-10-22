import axios from 'axios';

const https = require('https');

export const customAxios = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        Accept: 'application/json',
    }
});

