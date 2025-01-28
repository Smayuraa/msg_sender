require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to render form
app.get('/', (req, res) => {
    res.render('index', { success: null, error: null }); // Pass default values for success and error
});

// Route to handle SMS sending
app.post('/send-sms', async (req, res) => {
    const { phoneNumber, messageBody } = req.body;

    try {
        const message = await client.messages.create({
            from: '+13084704056', // Replace with your Twilio phone number
            to: phoneNumber,      // Phone number from the form
            body: messageBody     // Message from the form
        });
        res.render('index', { success: `Message sent! SID: ${message.sid}`, error: null });
    } catch (error) {
        res.render('index', { success: null, error: `Error: ${error.message}` });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
