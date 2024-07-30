import React, { useState } from 'react';
import './Chatbot.css'; // Create CSS for styling

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const sendMessage = async (text) => {
        try {
            // Add the user's message to the chat history
            setChatHistory(prevChatHistory => [
                ...prevChatHistory,
                { sender: 'user', text }
            ]);

            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text, sessionId: 'unique-session-id' }), // Unique session ID
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const reply = data.reply;

            // Add the bot's reply to the chat history
            setChatHistory(prevChatHistory => [
                ...prevChatHistory,
                { sender: 'bot', text: reply }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="avatar-chatbot">
            <div className="cards">
                <div className="card">
                    <div className="card-icon">🌦️</div>
                    <p>Get the latest weather updates.</p>
                </div>
                <div className="card">
                    <div className="card-icon">📅</div>
                    <p>Schedule appointments with ease.</p>
                </div>
                <div className="card">
                    <div className="card-icon">💬</div>
                    <p>24/7 customer support at your fingertips.</p>
                </div>
                <div className="card">
                    <div className="card-icon">⏰</div>
                    <p>Set and manage your task reminders.</p>
                </div>
            </div>

            <div className="chat-history">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat-message ${chat.sender}`}>
                        <p className=''>{chat.sender === 'user' ? `User: ${chat.text}` : `Bot: ${chat.text}`}</p>
                    </div>

                ))}
            </div>

             
            <input
                type="text"
                placeholder='Message Bot'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default Chatbot;
