const { Kafka } = require('kafkajs');
const { OpenSeaStreamClient, Network } = require('@opensea/stream-js');
const { WebSocket } = require('ws');
const { LocalStorage } = require('node-localstorage');
const process = require('process');
require('dotenv').config();

// Function to get duration from command line arguments
function getDuration() {
    const args = process.argv.slice(2);
    const durationIndex = args.indexOf('--duration');
    if (durationIndex > -1 && args[durationIndex + 1]) {
        return parseInt(args[durationIndex + 1], 10);
    }
    return null; // Null means indefinite run
}

// Initialize Kafka client and producer
const openseaApiKey = process.env.OPENSEA_API_KEY;
const kafka = new Kafka({
    clientId: 'test-producer',
    brokers: ['localhost:9097'],
});
const producer = kafka.producer();
const admin = kafka.admin();
const duration = getDuration();

// Function to create Kafka topic
async function createTopic() {
    await admin.connect();
    try {
        await admin.createTopics({
            topics: [{ topic: 'test-os_event_24hr', numPartitions: 4 }],
        });
        console.log('Topic created');
    } catch (error) {
        if (error.type === 'TOPIC_ALREADY_EXISTS') {
            console.log('Topic already exists');
        } else {
            throw error;
        }
    } finally {
        await admin.disconnect();
    }
}

// Test OpenSea Producer
async function testOpenSeaProducer() {
    const client = new OpenSeaStreamClient({
        token: openseaApiKey,
        network: Network.MAINNET,
        onError: (err) => console.error('OpenSea Stream Error:', err),
        logLevel: 'info',
        connectOptions: {
            transport: WebSocket,
            sessionStorage: LocalStorage
        }
    });

    let eventCount = 0;

    const eventPromise = new Promise((resolve) => {
        producer.connect();
        client.onItemSold('*', async (event) => {
            eventCount++;
            console.log(event, 'Received Item Sold Event: #', eventCount);

            // Send event to Kafka
            try {
                await producer.send({
                    topic: 'test-os_event_24hr',
                    messages: [{ value: JSON.stringify(event) }],
                });
            } catch (error) {
                console.error('Error sending event to Kafka:', error);
            }
        });

        // Set a timeout to run the function for the specified duration
        if (duration !== null) {
            setTimeout(() => {
                console.log('Timeout passed. Disconnecting from OpenSea Stream API and Kafka...');
                client.disconnect();
                producer.disconnect();
                resolve();
            }, duration);
        }
    });

    // Simulate connection (if needed)
    client.connect();

    // Wait until events are handled or timeout
    if (duration !== null) {
        await eventPromise;
    }

    // Disconnect the client
    client.disconnect();
    await producer.disconnect();
}

// Run tests
(async () => {
    await createTopic();
    await testOpenSeaProducer();
})();