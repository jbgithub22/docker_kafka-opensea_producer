// ... (your existing imports and Kafka/OpenSea client setup)
const process = require('process');
// Function to get duration from command line arguments
function getDuration() {
    const args = process.argv.slice(2);
    const durationIndex = args.indexOf('--duration');
    if (durationIndex > -1 && args[durationIndex + 1]) {
        return parseInt(args[durationIndex + 1], 10);
    }
    return null; // Null means indefinite run
}

const duration = getDuration();

async function testOpenSeaProducer() {
    const client = new OpenSeaStreamClient({
        token: openseaApiKey,
        network: Network.MAINNET,
        onError: (err) => console.error('OpenSea Stream Error:', err),
        transport: WebSocket,
        sessionStorage: LocalStorage
    });

    // ... (your existing `onItemSold` event listener)

    const eventPromise = new Promise((resolve) => {
        // ... (your existing producer.connect and client.onItemSold)
        if (duration !== null) {
            setTimeout(() => {
                console.log('Timeout passed. Disconnecting from OpenSea Stream API and Kafka...');
                client.disconnect();
                producer.disconnect();
                resolve();
            }, duration);
        }
    });

    await eventPromise;
    // ... (rest of your disconnect logic)
}

(async () => {
  // Your createTopic() function here
  await createTopic();
  await testOpenSeaProducer();
})();