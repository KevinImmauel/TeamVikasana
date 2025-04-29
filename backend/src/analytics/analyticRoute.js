const { chatWithGeminiAnalyst } = require('./geminiAnalytics');
const { getData } = require('../chatbot/fetchData');
const express = require('express');
const router = express.Router();

router.get('/crime-trends', async (req, res) => {
    try {
        // Fetch data by calling the function in fetchData module
        const data = await getData();

        // // Check if any of the data is missing and handle accordingly
        // if (!incidents || !sos || !stations) {
        //     return res.status(404).json({ error: 'Data not available.' });
        // }

        const prompt = `
You are a Police Station Analytics Assistant AI.

Here is the available data:

1. **Stations**:
${JSON.stringify(data, null, 2)}

2. **Incidents**:
${JSON.stringify(data, null, 2)}

3. **SOS Alerts**:
${JSON.stringify(data, null, 2)}

Please analyze the data and return crime trend insights using the following guidelines:

- Use **concise bullet points only** — no long paragraphs.
- Each point should begin with a relevant **emoji or icon** (e.g., 🚨, 📍, ⚠️, ✅, ⏱).
- Highlight key crime trends, patterns, correlations between SOS and incidents.
- Provide **actionable** insights useful for law enforcement.
- Avoid repeating raw data or giving general suggestions — focus on insights derived from the data.
`;

        // Send the prompt to Gemini for generating the response
        const reply = await chatWithGeminiAnalyst(prompt);
        res.json({ reply });
    } catch (error) {
        console.error('Error chatting with Gemini:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
