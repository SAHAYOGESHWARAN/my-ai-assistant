import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './styles/App.css';

const socket = io.connect('http://localhost:5000');

const App = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  // Initialize Speech Recognition and Synthesis
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();

  const synth = window.speechSynthesis;

  useEffect(() => {
    socket.on('response', (data) => {
      setResponse(data);
      speak(data); // Speak the response
    });
  }, []);

  const speak = (text) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = /[\u0B80-\u0BFF]/.test(text) ? 'ta-IN' : 'en-US'; // Tamil or English
    synth.speak(utterThis);
  };

  const handleVoiceInput = () => {
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      socket.emit('message', transcript); // Send voice input to server
    };
  };

  return (
    <div className="App">
      <h1>AI Assistant</h1>
      <button onClick={handleVoiceInput}>Speak</button>
      <p>You said: {message}</p>
      <p>Response: {response}</p>
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Header from './components/Header'; // Import the new Header component

const socket = io.connect('http://localhost:5000');

const App = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();
  const synth = window.speechSynthesis;

  useEffect(() => {
    socket.on('response', (data) => {
      setResponse(data);
      speak(data);
    });
  }, []);

  const speak = (text) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = /[\u0B80-\u0BFF]/.test(text) ? 'ta-IN' : 'en-US'; // Tamil or English
    synth.speak(utterThis);
  };

  const handleVoiceInput = () => {
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      socket.emit('message', transcript);
    };
  };

  return (
    <div className="App">
      <Header /> {/* Use the Header component */}
      <button onClick={handleVoiceInput}>Speak</button>
      <p>You said: {message}</p>
      <p>Response: {response}</p>
    </div>
  );
};

export default App;
