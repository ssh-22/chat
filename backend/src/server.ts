import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

interface Message {
  authorId: string;
  authorName: string;
  content: string;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const broadcastMessage = (message: Message): void => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

wss.on('connection', (ws) => {
  const userId = uuidv4();
  console.log('WebSocket connected');

  ws.send(JSON.stringify({ type: 'userId', userId }));

  ws.on('message', async (messageJson: string) => {
    const message = JSON.parse(messageJson) as Message;
    console.log(`Received: ${message.content}`);

    message.authorId = userId;
    broadcastMessage(message);
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});
