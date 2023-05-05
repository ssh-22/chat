// Worker

export default {
  async fetch(request, env) {
    return await handleRequest(request, env);
  },
};

async function handleRequest(request, env) {
  const upgradeHeader = request.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  let url = new URL(request.url);
  let name = url.searchParams.get("name") || 'defaultChatRoom';

  let id = env.CHAT_ROOM.idFromName(name);
  let obj = env.CHAT_ROOM.get(id);

  let resp = await obj.fetch(request);
  return resp;
}

// Durable Object

export class ChatRoom {
  constructor(state, env) {
    this.clients = new Map();
  }

  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/wss') {
      const { 0: client, 1: server } = new WebSocketPair();

      const userId = generateUUID();
      server.accept();

      server.send(JSON.stringify({ type: 'userId', userId }));

      server.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        data.authorId = userId;
        this.broadcast(data);
      });

      server.addEventListener('close', (event) => {
        this.clients.delete(userId);
      });

      this.clients.set(userId, server);

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response('Not found', { status: 404 });
  }

  broadcast(message) {
    for (const client of this.clients.values()) {
      client.send(JSON.stringify(message));
    }
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
