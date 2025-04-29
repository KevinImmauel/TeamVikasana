const { GoogleGenerativeAI } = require('@google/generative-ai');
const {GEMINI_API_KEY1} = require("../config/config")

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY1);

async function chatWithGeminiAnalyst(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

module.exports = { chatWithGeminiAnalyst };
