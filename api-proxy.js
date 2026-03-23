const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

export default async function handler(req, res) {
    const { url } = req.query;
    const proxy = 'http://103.179.46.49:6789'; // ඔබේ Proxy එක
    const agent = new HttpsProxyAgent(proxy);

    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("Proxy Error: " + error.message);
    }
}