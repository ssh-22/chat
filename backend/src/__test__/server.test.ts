import WebSocket from 'ws';
import { Server as HttpServer } from 'http';
import express from 'express';
import { startServer, Message } from '../server';

const app = express();
const testServer = new HttpServer(app);
let client: WebSocket;
const testPort = 3002;

beforeAll((done) => {
  startServer(testServer, testPort, done);
});

afterAll((done) => {
  testServer.close(done);
});

beforeEach(() => {
  client = new WebSocket(`ws://localhost:${testPort}`);
});

afterEach(() => {
  client.close();
});

const waitForMessage = (socket: WebSocket): Promise<string> => {
  return new Promise((resolve) => {
    socket.once('message', (message) => {
      resolve(message as string);
    });
  });
};

test('ユーザーが接続したときにIDが割り当てられる', async () => {
  const message = await waitForMessage(client);
  const parsedMessage = JSON.parse(message);
  expect(parsedMessage.type).toBe('userId');
  expect(parsedMessage.userId).toBeTruthy();
});

test('すべてのクライアントにメッセージがブロードキャストされる', (done) => {
  const client2 = new WebSocket(`ws://localhost:${testPort}`);
  const testMessage: Message = {
    authorId: '',
    authorName: 'Test User',
    content: 'Hello, World!',
  };

  client2.on('message', (message) => {
    const receivedMessage = JSON.parse(message as string);
    if (receivedMessage.type === 'userId') {
      client2.send(JSON.stringify(testMessage));
    }
  });

  client2.on('close', () => {
    done();
  });

  client.on('message', (message) => {
    const receivedMessage = JSON.parse(message as string) as Message;
    if (receivedMessage.type !== 'userId') {
      expect(receivedMessage.authorName).toBe(testMessage.authorName);
      expect(receivedMessage.content).toBe(testMessage.content);
      client2.close();
    }
  });
});
