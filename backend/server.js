const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SessionsClient } = require('@google-cloud/dialogflow');
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Path to your service account key file
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const client = new SessionsClient({ keyFilename: serviceAccountPath });

// Route to handle chat messages
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const sessionId = req.body.sessionId || 'unique-session-id'; // You can generate or provide a session ID

    const sessionPath = client.projectAgentSessionPath('ai-assistance-429910', sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US',
            },
        },
    };

    try {
        const [response] = await client.detectIntent(request);
        const reply = response.queryResult.fulfillmentText;
        res.json({ reply });
    } catch (error) {
        console.error('Error detecting intent:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
