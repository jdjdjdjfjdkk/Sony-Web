const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    const { url } = req.query;
    if (!url) return res.status(400).send("URL missing");

    // ඔබ ලබාගත් හොඳම Proxy එකක් මෙතනට දමන්න
    const proxy = 'http://167.103.31.122:8800'; 
    const agent = new HttpsProxyAgent(proxy);

    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            timeout: 15000,
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*'
            },
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'text/plain');
        res.send(Buffer.from(response.data));
    } catch (error) {
        res.status(500).send("Proxy Error: " + error.message);
    }
}
