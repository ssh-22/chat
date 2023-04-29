import express from 'express';
import { createServer } from 'http';
import { Server, OPEN as WebSocketOpen } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  authorId: string;
  authorName: string;
  content: string;
}

require('dotenv').config();
const app = express();
const server = createServer(app);

server.listen(3001, () => console.log('Server listening on port 3001'));

const wss = new Server({ server });

const broadcastMessage = (message: Message): void => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketOpen) {
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
