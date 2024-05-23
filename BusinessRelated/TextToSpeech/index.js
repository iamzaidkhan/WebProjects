const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/convert', async (req, res) => {
    const { text } = req.body;

    // Here you would call your TTS API
    // This is an example using a hypothetical TTS API endpoint
    try {
        const response = await axios.post('https://api.example.com/tts', {
            text: text
        }, {
            responseType: 'arraybuffer'
        });

        res.set('Content-Type', 'audio/mp3');
        res.send(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
