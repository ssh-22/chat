import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface Message {
  authorId: string;
  authorName: string;
  content: string;
}

interface MessageProps extends Message {
  userId: string | null;
}

interface UserData {
  type: string;
  userId: string;
}

const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    websocket.current = new WebSocket(url);

    websocket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type) {
        setUserId(data.userId);
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
  }, [url]);

  const sendMessage = (message: Message) => {
    if (websocket.current) {
      websocket.current.send(JSON.stringify(message));
    }
  };

  return { messages, userId, sendMessage };
};

const Message: React.FC<MessageProps> = ({
  content,
  authorName,
  authorId,
  userId,
}) => {
  const isMe = authorId === userId;
  return (
    <li className={`message-item ${isMe ? 'me' : 'others'}`}>
      {!isMe && (
        <div className='message-avatar'>
          <img
            className='user-icon'
            src={`https://i.pravatar.cc/300?u=${authorId}`}
            alt='avatar'
          />
        </div>
      )}
      <div className='message-content'>{content}</div>
    </li>
  );
};

const Chat: React.FC = () => {
  const { messages, userId, sendMessage } = useWebSocket('ws://localhost:3001');
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    const message: Message = {
      content: inputMessage,
      authorName: 'User',
      authorId: '',
    };

    sendMessage(message);
    setInputMessage('');
  };

  const handleCameraButtonClick = () => {
    console.log('called');
  };

  return (
    <div className='chat-container' data-testid='chat-container'>
      <header className='chat-header'>
        <h1 className='chat-title'>チャット</h1>
        <div className='header-actions'>
          <button className='call-button'>
            <FontAwesomeIcon icon={faPhone} color='#4f83e1' size='lg' />
          </button>
        </div>
      </header>
      <ul className='messages-list'>
        {messages.map((message, index) => (
          <Message key={index} {...message} userId={userId} />
        ))}
      </ul>
      <form
        className='input-form'
        onSubmit={handleSendMessage}
        data-testid='input-form'
      >
        <input
          type='text'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          data-testid='input'
        />
        <button type='submit' data-testid='submit'>
          <FontAwesomeIcon icon={faPaperPlane} color='blue' size='lg' />
        </button>
      </form>
    </div>
  );
};

export default Chat;
