import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Message from './Message';
import useWebSocket from '../../hooks/useWebSocket';
import styles from './Chat.module.css';
import { MessageType } from '../../types/chatTypes';

const Chat: React.FC = () => {
  const WebSocketUrl =
    process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001';
  const messageMainRef = useRef<HTMLDivElement>(null);
  const { messages, userId, sendMessage } = useWebSocket(WebSocketUrl);
  const [inputMessage, setInputMessage] = useState('');
  const [rows, setRows] = useState(1);

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages]);

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
  };

  const handleInputMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputMessage(e.target.value);
    const numLines = e.target.value.split('\n').length;
    setRows(numLines > 9 ? 9 : numLines);
  };

  const scrollToLatestMessage = () => {
    setTimeout(() => {
      if (messageMainRef.current) {
        messageMainRef.current.scrollTop =
          messageMainRef.current.scrollHeight + 10;
      }
    }, 100);
  };

  return (
    <div className={styles.chatContainer} data-testid='chat-container'>
      <header className={styles.chatHeader}>
        <h1 className={styles.chatTitle}>チャット</h1>
        <div className={styles.headerActions}>
          <button className={styles.callButton}>
            <FontAwesomeIcon icon={faPhone} color='#4f83e1' size='lg' />
          </button>
        </div>
      </header>
      <div className={styles.messagesMain} ref={messageMainRef}>
        <ul className={styles.messagesList}>
          {messages.map((message, index) => (
            <Message key={index} {...message} userId={userId} />
          ))}
        </ul>
      </div>
      <footer className={styles.inputFooter}>
        <form
          className={styles.inputForm}
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
