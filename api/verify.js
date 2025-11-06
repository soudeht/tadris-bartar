// api/verify.js
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function fetchAndExtractText(url) {
    try {
        const res = await axios.get(url, { headers: { 'User-Agent': 'Tadris-Bartar-Checker/1.0' }, timeout: 10000 });
        const $ = cheerio.load(res.data);
        let text = '';
        if ($('article').length) text = $('article').text();
        else $('p').each((i, el) => text += $(el).text() + '\n');
        text = text.replace(/\s{2,}/g, ' ').trim();
        if (text.length > 20000) text = text.slice(0, 20000);
        return { success: true, text, title: $('title').text() || '' };
    } catch (err) { return { success: false, error: err.message || String(err) }; }
}

function buildPrompt({ text, url, title }) {
    return `
تو یک کارشناس بررسی اخبار فارسی هستی...
(همان prompt از قبل)
  `.trim();
}

async function callOpenAIChat(prompt) {
    if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set');
    const payload = { model: 'gpt-4', messages: [{ role: 'user', content: prompt }], temperature: 0.0, max_tokens: 800 };
    const r = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers: { Authorization: `Bearer ${OPENAI_KEY}` }, timeout: 20000 });
    return r.data.choices ? .[0] ? .message ? .content || JSON.stringify(r.data);
}

module.exports = async(req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { url, text } = req.body;
        if (!url && !text) return res.status(400).json({ error: 'url یا text لازم است' });

        let extracted = { text: text || '', title: '' };
        if (url && !text) {
            const out = await fetchAndExtractText(url);
            if (out.success) extracted = { text: out.text, title: out.title };
        }

        const prompt = buildPrompt({ text: extracted.text || text, url, title: extracted.title });
        const reply = await callOpenAIChat(prompt);

        let parsed;
        try { parsed = JSON.parse(reply); } catch (e) { parsed = { verdict: 'inconclusive', confidence: 0, reason: 'پاسخ مدل قابل پارس JSON نبود', raw: reply }; }

        return res.status(200).json({ ok: true, parsed });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || String(err) });
    }
};