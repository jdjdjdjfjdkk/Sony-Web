const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

export default async function handler(req, res) {
    // CORS Headers එකතු කිරීම (ඕනෑම තැනක සිට වැඩ කිරීමට)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;
    if (!url) return res.status(400).send("URL missing");

    // ඔබ ලබාගත් අලුත් ඉන්දියානු Proxy එක
    const proxy = 'http://167.103.34.108:8800'; 
    const agent = new HttpsProxyAgent(proxy);

    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            timeout: 15000, // තත්පර 15ක් රැඳී සිටීම
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Origin': 'https://sony.rojoni9589.workers.dev'
            },
            responseType: 'arraybuffer' // දත්ත නිවැරදිව ලබා ගැනීමට
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        res.send(Buffer.from(response.data));

    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).send("Proxy failed to connect to India. Error: " + error.message);
    }
}
