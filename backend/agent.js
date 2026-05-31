const express       = require('express');
const http   = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const metricsRouter = require('./routes/metrics');
const { getAllMetrics } = require('./services/systemMetrics');
const app  = express();
const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const NODE_ID = process.env.NODE_ID || 'local';
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/metrics', metricsRouter);

wss.on('connection', (ws) => {
    console.log('Client connected');

    const interval = setInterval(async () => {
        if (ws.readyState === WebSocket.OPEN) {
            const metrics = await getAllMetrics();
            ws.send(JSON.stringify({ 
            nodeId: NODE_ID, 
            metrics 
}));
        }
    }, 2000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/*
Commands below you put in browser to test WebSocket connection:
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('Connected');
};

socket.onmessage = (event) => {
    console.log('Received:', JSON.parse(event.data));
};

socket.onclose = () => {
    console.log('Disconnected');
};
*/