const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let producerProcess = null;

app.post('/start-producer', (req, res) => {
    if (producerProcess) {
        return res.status(409).send('Producer is already running.');
    }

    const { duration } = req.body;
    const args = duration ? ['--duration', duration] : [];

    producerProcess = spawn('node', [path.join(__dirname, 'opensea-kafka-producer.js'), ...args], {
        detached: true,
        stdio: 'ignore'
    });

    producerProcess.unref();

    res.status(200).send('Producer started successfully.');
});

app.post('/stop-producer', (req, res) => {
    if (producerProcess) {
        producerProcess.kill();
        producerProcess = null;
        res.status(200).send('Producer stopped.');
    } else {
        res.status(404).send('Producer not running.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});