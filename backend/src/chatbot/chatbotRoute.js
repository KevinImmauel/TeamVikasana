const { chatWithGemini } = require('./gemini');
const { getData } = require('./fetchData');
const express = require('express');
const router = express.Router();

const cachedData = getData();

router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        console.log(req.body.message)

        const prompt = `
You are a Police Beat Management Assistant AI.
User asked: "${userMessage}".

Here is the available data:

Beats:
${JSON.stringify(cachedData.beats)}

Incidents:
${JSON.stringify(cachedData.incidents)}

SOS alerts:
${JSON.stringify(cachedData.sos)}

Use only the available data to answer questions.
If information is missing, politely say "Data not available."
`;

        const reply = await chatWithGemini(prompt);
        console.log(reply)
        res.json({ reply });
    } catch (error) {
        console.error('Error chatting with Gemini:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
