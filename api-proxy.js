const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL missing");

    // ඔබේ ඉන්දියානු Proxy එක (මෙය වැඩ නොකරයි නම් අලුත් එකක් දමන්න)
    const proxy = 'http://103.179.46.49:6789'; 
    const agent = new HttpsProxyAgent(proxy);

    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            timeout: 10000, // තත්පර 10ක කාලයක් දෙනවා
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            }
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', response.headers['content-type']);
        
        // ප්ලේලිස්ට් එකේ Data ටික යැවීම
        if (typeof response.data === 'string') {
            res.send(response.data);
        } else {
            response.data.pipe(res);
        }
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).send("Proxy failed: " + error.message);
    }
}
