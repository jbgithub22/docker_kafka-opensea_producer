document.getElementById('startButton').addEventListener('click', async () => {
    const duration = document.getElementById('duration').value;
    const response = await fetch('/start-producer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: duration ? parseInt(duration, 10) : null })
    });
    const status = await response.text();
    document.getElementById('status').innerText = status;
});

document.getElementById('stopButton').addEventListener('click', async () => {
    const response = await fetch('/stop-producer', {
        method: 'POST'
    });
    const status = await response.text();
    document.getElementById('status').innerText = status;
});