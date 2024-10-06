import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Header from './components/Header'; // Import the Header component
import FileUpload from './components/FileUpload'; // Import the FileUpload component
import './styles/App.css'; // Import your CSS file

const socket = io.connect('http://localhost:5000');

const App = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  // Initialize Speech Recognition and Synthesis
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();
  const synth = window.speechSynthesis;

  useEffect(() => {
    // Socket listener for response from server
    socket.on('response', (data) => {
      setResponse(data);
      speak(data); // Speak the response
    });
  }, []);

  // Function to speak text in Tamil or English based on content
  const speak = (text) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    // Language detection (Tamil or English)
    utterThis.lang = /[\u0B80-\u0BFF]/.test(text) ? 'ta-IN' : 'en-US';
    synth.speak(utterThis);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    recognition.start(); // Start voice recognition

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Get the voice input
      setMessage(transcript);
      socket.emit('message', transcript); // Send the voice input to server
    };
  };

  return (
    <div className="App">
      <Header /> {/* Render Header component */}
      <h1>AI Assistant</h1>
      <button onClick={handleVoiceInput}>Speak</button> {/* Button to activate voice input */}
      <p>You said: {message}</p> {/* Display the message spoken by user */}
      <p>Response: {response}</p> {/* Display the response from the server */}
      
      <FileUpload /> {/* Render FileUpload component */}
    </div>
  );
};

export default App;
