import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

interface Message {
  authorId: string;
  authorName: string;
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    websocket.current = new WebSocket('ws://localhost:3001');

    websocket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    websocket.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    const message: Message = {
      content: inputMessage,
      authorName: 'User',
      authorId: '',
    };

    if (websocket.current) {
      websocket.current.send(JSON.stringify(message));
    }
    setInputMessage('');
  };

  const Message = ({ content, authorName, authorId }: Message) => {
    return (
      <li key={authorId} className={`message-item ${authorId === "me" ? "me" : "others"}`}>
        <div className="message-avatar">
          <img src={`https://i.pravatar.cc/300?u=${authorId}`} alt="avatar" />
        </div>
        <div className="message-content">
          <b>{authorName}: </b>
          {content}
        </div>
      </li>
    )
  };

  return (
    <div>
      <ul className="messages-list">
        {messages.map((message) => (
          <Message key={message.authorId} authorId={message.authorId} authorName='' content={message.content} />
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
