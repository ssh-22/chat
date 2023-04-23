import express from 'express';
import { createServer } from 'http';
import { Server } from 'ws';
import { Configuration, OpenAIApi } from "openai";

interface Message {
  author: string;
  content: string;
}

require('dotenv').config();
const app = express();
const server = createServer(app);

server.listen(3001, () => console.log('Server listening on port 3001'));

const wss = new Server({ server });

const chatGptApi = async (message: string): Promise<string> => {
  const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: message,
  });
  console.log(completion.data.choices[0].text)
  return completion.data.choices[0].text;
};

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  ws.on('message', async (messageJson: string) => {
    const message = JSON.parse(messageJson) as Message;
    console.log(`Received: ${message.content}`);

    const gptResponse = await chatGptApi(message.content);

    ws.send(JSON.stringify({ author: 'ChatGPT', content: gptResponse }));
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});
