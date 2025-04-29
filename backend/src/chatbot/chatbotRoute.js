const { chatWithGemini } = require('./gemini');
const { getData } = require('./fetchData');
const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Fetch data by calling the function in fetchData module
        const { incidents, sos, stations } = await getData();

        // Check if any of the data is missing and handle accordingly
        if (!incidents || !sos || !stations) {
            return res.status(404).json({ error: 'Data not available.' });
        }

        const prompt = `
You are a Police Station Analytics Assistant AI.
User asked: "${userMessage}".

Here is the available data:

Stations:
${JSON.stringify(stations, null, 2)}

Incidents:
${JSON.stringify(incidents, null, 2)}

SOS alerts:
${JSON.stringify(sos, null, 2)}

Use only the available data to answer questions.
If information is missing, politely say "Data not available."
`;

        // Send the prompt to Gemini for generating the response
        const reply = await chatWithGemini(prompt);
        res.json({ reply });
    } catch (error) {
        console.error('Error chatting with Gemini:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
