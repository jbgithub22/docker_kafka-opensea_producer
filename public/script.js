document.addEventListener('DOMContentLoaded', () => {
    const durationInputs = {
        hours: document.getElementById('duration-value-hrs'),
        days: document.getElementById('duration-value-days'),
        untilStopped: null
    };

    const outputSettings = {
        kafka: document.getElementById('kafka-settings'),
        csv: document.getElementById('csv-settings')
    };

    const durationRadioButtons = document.querySelectorAll('input[name="duration-type"]');
    durationRadioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedType = event.target.value;
            document.getElementById('hours-input-container').style.display = selectedType === 'hours' ? 'flex' : 'none';
            document.getElementById('days-input-container').style.display = selectedType === 'days' ? 'flex' : 'none';
        });
    });

    const outputRadioButtons = document.querySelectorAll('input[name="output-type"]');
    outputRadioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedOutput = event.target.value;
            outputSettings.kafka.style.display = selectedOutput === 'kafka' ? 'block' : 'none';
            outputSettings.csv.style.display = selectedOutput === 'csv' ? 'block' : 'none';
        });
    });

    document.getElementById('startButton').addEventListener('click', async () => {
        const durationType = document.querySelector('input[name="duration-type"]:checked').value;
        let duration = null;
        if (durationType === 'hours') {
            duration = parseInt(durationInputs.hours.value, 10) * 60 * 60 * 1000;
        } else if (durationType === 'days') {
            duration = parseInt(durationInputs.days.value, 10) * 24 * 60 * 60 * 1000;
        }

        const outputType = document.querySelector('input[name="output-type"]:checked').value;
        let outputSettingsData = {};
        if (outputType === 'kafka') {
            outputSettingsData = {
                topic: document.getElementById('kafka-topic').value,
                clientId: document.getElementById('kafka-clientId').value,
                brokers: document.getElementById('kafka-brokers').value
            };
        } else if (outputType === 'csv') {
            // Note: The file path for a CSV output would typically be handled server-side.
            // The `webkitdirectory` attribute allows the user to select a directory, but the
            // JavaScript cannot read the full file path for security reasons.
            // This is a client-side representation of the user selecting a save location.
            const fileInput = document.getElementById('csv-location');
            outputSettingsData = {
                saveLocation: fileInput.files.length > 0 ? fileInput.files[0].webkitRelativePath.split('/')[0] : 'N/A'
            };
        }

        const response = await fetch('/start-producer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                duration: duration,
                outputType: outputType,
                settings: outputSettingsData
            })
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
});