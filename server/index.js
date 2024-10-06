require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const http = require('http');
const fs = require('fs');
const { Server } = require('socket.io');
const { Configuration, OpenAIApi } = require('openai');
const { controlRobot } = require('./robotControl'); // Robot control function
const fileUploadRoutes = require('./routes/fileUpload'); // File upload routes

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configure OpenAI API with key from environment variables
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is stored in .env
}));

// Logging setup
const logFilePath = './logs/server.log';
const logMessage = (message) => {
  const timeStamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `${timeStamp} - ${message}\n`);
};

// Middleware to parse JSON bodies
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logMessage(`Received ${req.method} request on ${req.url}`);
  next();
});

// Use file upload routes
app.use('/upload', fileUploadRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logMessage('A user connected via socket');
  console.log('A user connected');

  socket.on('message', async (message) => {
    console.log('Received message:', message);
    logMessage(`Received message: ${message}`);

    try {
      // OpenAI GPT-3/4 request for AI response
      const completion = await openai.createCompletion({
        model: 'text-davinci-003', // You can change to 'gpt-4' if available
        prompt: `Respond in Tamil or English: ${message}`,
        max_tokens: 100,
      });

      const aiResponse = completion.data.choices[0].text.trim();
      console.log('AI response:', aiResponse);
      logMessage(`AI response: ${aiResponse}`);

      // Control robot based on AI response
      controlRobot(aiResponse); // Example to send command to the robot

      // Send the response back to the client
      socket.emit('response', aiResponse);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      logMessage(`Error with OpenAI API: ${error.message}`);
      socket.emit('response', 'Sorry, I encountered an issue.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    logMessage('User disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
  logMessage('Server started on http://localhost:5000');
});
