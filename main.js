document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkButton');
    const steamIdInput = document.getElementById('steamIdInput');
    const resultDiv = document.getElementById('result');

    checkButton.addEventListener('click', async () => {
        const steamId = steamIdInput.value.trim();

        try {
            if (!steamId) {
                throw new Error('Steam ID is required');
            }

            const response = await fetch(`http://localhost:42960/api/steam/${steamId}`);
            const data = await response.json();

            // Logging the response and data
            console.log('Response:', response);
            console.log('Data:', data);

            // Check if response contains an error property
            if (data.error) {
                throw new Error(data.error);
            }

            displayResult(data);
        } catch (error) {
            console.error('Error:', error);
            resultDiv.textContent = 'Error fetching data from server.';
        }
    });

    function displayResult(data) {
        resultDiv.innerHTML = `
            <p>Account Creation Date: ${data.accountCreationDate}</p>
            <p>VAC Status: ${data.vacBanStatus}</p>
        `;
    }
});