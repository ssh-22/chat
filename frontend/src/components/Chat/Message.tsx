import React from 'react';
import { MessageProps } from '../../types/chatTypes';
import styles from './Chat.module.css';

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
    <div className={styles.timestamp}>
      <span style={{ fontSize: '8pt' }}>{formattedTimestamp}</span>
    </div>
  );
  const messageAvatarElement = (
    <div className={styles.messageAvatar}>
      <img
        className={styles.userIcon}
        src={`https://i.pravatar.cc/300?u=${authorId}`}
        alt='avatar'
      />
    </div>
  );
  return (
    <li className={`${styles.messageItem} ${isMe ? styles.me : styles.others}`}>
      {isMe && timestampElement}
      {!isMe && messageAvatarElement}
      <div className={styles.messageContent}>{content}</div>
      {!isMe && timestampElement}
    </li>
  );
};

export default Message;
