const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for the key
});

const openai = new OpenAIApi(configuration);

module.exports = { openai };
