const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Route handler for /api/steam/:steamId
app.get('/api/steam/:steamId', async (req, res) => {
    try {
        const apiKey = process.env.STEAM_API_KEY;
        const steamId = req.params.steamId;

        // Make request to Steam API to fetch data
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`);

        // Send data back to client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});