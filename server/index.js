const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Configuration, OpenAIApi } = require('openai');
const { controlRobot } = require('../robot/robotControl'); // Import robotics control


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const openai = new OpenAIApi(new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY',
}));

//robot
socket.on('message', async (message) => {
    console.log('Received: ', message);
  
    // Process message with OpenAI GPT-3/4
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Respond in Tamil or English: ${message}`,
      max_tokens: 100,
    });
  
    const aiResponse = completion.data.choices[0].text.trim();
  
    // Control robot based on AI response
    controlRobot(aiResponse);
  
    socket.emit('response', aiResponse);
  });


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


require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { openai } = require('./config/openaiConfig'); // Use the openai config file
const { controlRobot } = require('./robotControl');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json()); // To parse JSON bodies

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (message) => {
    console.log('Received: ', message);

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Respond in Tamil or English: ${message}`,
        max_tokens: 100,
      });

      const aiResponse = completion.data.choices[0].text.trim();
      controlRobot(aiResponse); // Example to send command to the robot
      socket.emit('response', aiResponse);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      socket.emit('response', 'Sorry, I encountered an issue.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

socket.on('message', async (message) => {
    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Respond in Tamil or English: ${message}`,
        max_tokens: 100,
      });
  
      const aiResponse = completion.data.choices[0].text.trim();
      controlRobot(aiResponse); // Example to send command to the robot
      socket.emit('response', aiResponse);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      socket.emit('response', 'Sorry, I encountered an issue.');
    }
  });
  