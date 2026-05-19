require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { twiml } = require('twilio');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Log storage
const logsFile = 'call_logs.json';
if (!fs.existsSync(logsFile)) {
    fs.writeFileSync(logsFile, JSON.stringify([]));
}

// Entry point when a call is received
app.post('/voice', (req, res) => {
    const response = new twiml.VoiceResponse();
    response.say('Welcome to the AI Call Center.');
    response.gather({
        action: '/gather-name',
        input: 'speech',
        timeout: 3
    }).say('Please say your name.');
    res.type('text/xml');
    res.send(response.toString());
});

// Handle name input
app.post('/gather-name', (req, res) => {
    const name = req.body.SpeechResult || 'Unknown';
    logData({ step: 'name', value: name });

    const response = new twiml.VoiceResponse();
    response.gather({
        action: '/gather-age',
        input: 'speech',
        timeout: 3
    }).say('Thank you. Please say your age.');
    res.type('text/xml');
    res.send(response.toString());
});

// Handle age input
app.post('/gather-age', (req, res) => {
    const age = req.body.SpeechResult || 'Unknown';
    logData({ step: 'age', value: age });

    const response = new twiml.VoiceResponse();
    response.say('Thank you for the information.');
    response.dial(process.env.FORWARD_NUMBER);
    res.type('text/xml');
    res.send(response.toString());
});

// Function to log data
function logData(entry) {
    const logs = JSON.parse(fs.readFileSync(logsFile));
    logs.push({ time: new Date().toISOString(), ...entry });
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));
}

// Endpoint to view logs
app.get('/logs', (req, res) => {
    const logs = JSON.parse(fs.readFileSync(logsFile));
    res.json(logs);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});






import button from R
const button=()=>{
    //logic
    return(<button>click me</button>);
};
export default button;
