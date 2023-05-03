import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface MessageType {
  authorId: string;
  authorName: string;
  content: string;
}

interface MessageProps extends MessageType {
  userId: string | null;
}

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
  const messageListRef = useRef<HTMLUListElement>(null);
  const [_previousScrollTop, setPreviousScrollTop] = useState<
    number | undefined
  >(undefined);
  const { messages, userId, sendMessage } = useWebSocket('ws://localhost:3001');
  const [inputMessage, setInputMessage] = useState('');
  const [rows, setRows] = useState(1);
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    const message: MessageType = {
      content: inputMessage,
      authorName: 'User',
      authorId: '',
    };
    sendMessage(message);
    setInputMessage('');
    setPreviousScrollTop(messageListRef.current?.scrollTop);
  };

  const handleInputMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputMessage(e.target.value);
    const numLines = e.target.value.split('\n').length;
    setRows(numLines > 9 ? 9 : numLines);
  };

  return (
    <div
      className='chat-container'
      data-testid='chat-container'
      style={isFocused ? { paddingBottom: '270px' } : { paddingBottom: '0' }}
    >
      <header className='chat-header'>
        <h1 className='chat-title'>チャット</h1>
        <div className='header-actions'>
          <button className='call-button'>
            <FontAwesomeIcon icon={faPhone} color='#4f83e1' size='lg' />
          </button>
        </div>
      </header>
      <ul className='messages-list' ref={messageListRef}>
        {messages.map((message, index) => (
          <Message key={index} {...message} userId={userId} />
        ))}
      </ul>
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
          onFocus={() => {
            setFocused(true);
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 200);
          }}
          onBlur={() => setFocused(false)}
          data-testid='textarea'
          rows={rows}
        />
        <button type='submit' data-testid='submit'>
          <FontAwesomeIcon icon={faPaperPlane} color='blue' size='lg' />
        </button>
      </form>
    </div>
  );
};

export default Chat;
