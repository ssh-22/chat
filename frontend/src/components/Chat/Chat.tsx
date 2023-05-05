import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface MessageType {
  authorId: string;
  authorName: string;
  content: string;
  timestamp: number;
}

interface MessageProps extends MessageType {
  userId: string | null;
}

const WebSocketUrl =
  process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001';
const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
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

  const sendMessage = (message: MessageType) => {
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
  timestamp,
}) => {
  const isMe = authorId === userId;
  const formattedTimestamp = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const timestampElement = (
    <div className='timestamp'>
      <span style={{ fontSize: '8pt' }}>{formattedTimestamp}</span>
    </div>
  );
  const messageAvatarElement = (
    <div className='message-avatar'>
      <img
        className='user-icon'
        src={`https://i.pravatar.cc/300?u=${authorId}`}
        alt='avatar'
      />
    </div>
  );
  return (
    <li className={`message-item ${isMe ? 'me' : 'others'}`}>
      {isMe && timestampElement}
      {!isMe && messageAvatarElement}
      <div className='message-content'>{content}</div>
      {!isMe && timestampElement}
    </li>
  );
};

const Chat: React.FC = () => {
  const messageMainRef = useRef<HTMLDivElement>(null);
  const { messages, userId, sendMessage } = useWebSocket(WebSocketUrl);
  const [inputMessage, setInputMessage] = useState('');
  const [rows, setRows] = useState(1);

  const today = new Date();
  const midnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
  );
  const timestamp = midnight.getTime();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    const message: MessageType = {
      content: inputMessage,
      authorName: 'User',
      authorId: '',
      timestamp,
    };
    sendMessage(message);
    setInputMessage('');
    setTimeout(() => {
      if (messageMainRef.current) {
        messageMainRef.current.scrollTop =
          messageMainRef.current.scrollHeight + 10;
      }
    }, 100);
  };

  const handleInputMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputMessage(e.target.value);
    const numLines = e.target.value.split('\n').length;
    setRows(numLines > 9 ? 9 : numLines);
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
      <div className='messages-main' ref={messageMainRef}>
        <ul className='messages-list'>
          {messages.map((message, index) => (
            <Message key={index} {...message} userId={userId} />
          ))}
        </ul>
      </div>
      <footer className='input-footer'>
        <form
          className='input-form'
          onSubmit={handleSendMessage}
          data-testid='input-form'
        >
          <textarea
            value={inputMessage}
            onChange={handleInputMessageChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            data-testid='textarea'
            rows={rows}
          />
          <button type='submit' data-testid='submit'>
            <FontAwesomeIcon icon={faPaperPlane} color='blue' size='lg' />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
