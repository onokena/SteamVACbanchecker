require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/api/steam/:steamId', async (req, res) => {
    try {
        const apiKey = process.env.STEAM_API_KEY;
        const steamId = req.params.steamId;

        const accountCreationDate = await getAccountCreationDate(steamId, apiKey);
        
        const vacBanStatus = await checkVacBanStatus(steamId, apiKey);
        
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`);

        res.json({ accountCreationDate, vacBanStatus });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getAccountCreationDate(steamId, apiKey) {
    const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`);
    const { timecreated } = response.data.response.players[0];
    return new Date(timecreated * 1000).toLocaleDateString();
}

async function checkVacBanStatus(steamId, apiKey) {
    const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apiKey}&steamids=${steamId}`);
    const { NumberOfVACBans } = response.data.players[0];
    return NumberOfVACBans > 0 ? 'Banned' : 'Not Banned';
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
