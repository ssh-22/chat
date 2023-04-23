import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

interface Message {
  authorId: string;
  authorName: string;
  content: string;
}

interface UserData {
  type: string;
  userId: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    websocket.current = new WebSocket('ws://localhost:3001');

    websocket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.current.onmessage = (event) => {

      const data = JSON.parse(event.data);
      if (data.type) {
        setUserId(data.userId)
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
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
    const isMe = authorId === userId;
    return (
      <li key={authorId} className={`message-item ${isMe ? "me" : "others"}`}>
        {!isMe && (
          <div className="message-avatar">
            <img
              className="user-icon"
              src={`https://i.pravatar.cc/300?u=${authorId}`}
              alt="avatar"
            />
          </div>
        )}
        <div className="message-content">{content}</div>
      </li>
    )
  };

  return (
    <div className='chat-container'>
      <ul className="messages-list">
        {messages.map((message, index) => (
          <Message key={index} authorId={message.authorId} authorName='' content={message.content} />
        ))}
      </ul>
      <form className='input-form' onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

export default Chat;
