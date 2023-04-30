import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

export interface Message {
  type?: string;
  authorId: string;
  authorName: string;
  content: string;
}

const app = express();

const broadcastMessage = (wss: WebSocket.Server, message: Message): void => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

export const startServer = (
  server: http.Server,
  port: number,
  callback?: () => void,
): void => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    const userId = uuidv4();
    console.log('WebSocket connected');

    ws.send(JSON.stringify({ type: 'userId', userId }));

    ws.on('message', async (messageJson: string) => {
      const message = JSON.parse(messageJson) as Message;
      console.log(`Received: ${message.content}`);

      message.authorId = userId;
      broadcastMessage(wss, message);
    });

    ws.on('close', () => {
      console.log('WebSocket disconnected');
    });
  });

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    if (callback) {
      callback();
    }
  });
};

const PORT = 3001;
const server = http.createServer(app);
startServer(server, PORT);
