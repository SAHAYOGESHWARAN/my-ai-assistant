const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const openai = new OpenAIApi(new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY',
}));

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (message) => {
    console.log('Received: ', message);

    // OpenAI GPT-3/4 Request for AI response
    const completion = await openai.createCompletion({
      model: 'text-davinci-003', // Or GPT-4 if available
      prompt: `Respond in Tamil or English: ${message}`,
      max_tokens: 100,
    });

    const aiResponse = completion.data.choices[0].text.trim();
    socket.emit('response', aiResponse);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
