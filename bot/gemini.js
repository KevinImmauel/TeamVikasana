const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatWithGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); // <-- UPDATED MODEL NAME

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

module.exports = { chatWithGemini };
