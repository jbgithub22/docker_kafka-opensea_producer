# 📝 OpenSea Docker Kafka Producer

This project provides a simple, containerized solution for streaming real-time NFT sales data from the OpenSea API to an Apache Kafka topic. It includes a basic web interface to control the producer's runtime, allowing you to run it for a set duration or indefinitely.

---

## Features

- **Real-time Data Streaming**: Connects to the OpenSea Stream API to capture `item_sold` events.  
- **Kafka Integration**: Sends event data to a Kafka topic for further processing and analysis.  
- **Dockerized Environment**: Uses Docker and Docker Compose to easily set up and run the application and a local Kafka cluster.  
- **Web UI**: A simple web interface to start, stop, and control the duration of the data producer.  

---

## Prerequisites

Before running this project, ensure the following are installed:

- [Node.js](https://nodejs.org/) & npm  
- [Docker](https://www.docker.com/) & Docker Compose  

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/opensea-producer.git
cd opensea-producer
```

### 2. Set up Environment Variables
Create a .env file in the project root and add your OpenSea API key:
```bash
OPENSEA_API_KEY=your_api_key_here
```

### 3. Run with Docker Compose
From the project root, build the Docker image and start all necessary services (Kafka, Zookeeper, Producer):
```bash
docker-compose up --build -d
```
### 4. Access the Web UI
Once containers are running, open your browser and go to:
```bash
http://localhost:3000
```

## Project Structure
```bash
opensea_producer/
├── .env                      # Environment variables
├── Dockerfile                # Docker image configuration for the producer
├── docker-compose.yml        # Orchestrates containers (Kafka, Zookeeper, Producer)
├── package.json              # Node.js project dependencies
├── package-lock.json
├── public/                   # Web UI files
│   ├── index.html            # Main HTML file for the UI
│   └── script.js             # JavaScript to handle UI interactions
└── src/
    ├── opensea-kafka-producer.js  # Core script that produces data to Kafka
    └── server.js                 # Express.js server for UI + process con
```

## File Descriptions

- **Dockerfile**: Instructions for building the Docker image of the Node.js application.

- **docker-compose.yml**: Defines the multi-container setup (Zookeeper, Kafka, Producer).

- **src/opensea-kafka-producer.js**: Connects to OpenSea API and sends item_sold events to Kafka. Accepts duration arguments via command line.

- **src/server.js**: Express server that handles HTTP requests from the Web UI to start/stop the producer using child_process.

- **public/**: Static files for the Web UI to control the producer without command-line interaction.