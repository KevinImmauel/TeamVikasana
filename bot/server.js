require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { chatWithGemini } = require('../backend/src/chatbot/gemini');
const { getData } = require('./fetchData');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const cachedData = getData(); 

app.get('/', (req, res) => {
  res.send('Chatbot Server Running');
});

// POST /chat
app.post('/chat', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
