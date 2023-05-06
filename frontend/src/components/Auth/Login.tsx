import React from 'react';
import styles from './Login.module.css';
import LoginButton from './LoginButton';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.mb5}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='60'
            height='60'
            viewBox='0 0 1024 1024'
          >
            <path
              fill='#000000'
              d='m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z'
            />
            <path
              fill='#000000'
              d='M512 563.2a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm192 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm-384 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4z'
            />
          </svg>
        </div>
        <div className={`${styles.mb2} text-center`}>Welcome to Chat</div>
        <div className={`${styles.mb4} text-center`}>
          Log in with your Chat account to continue
        </div>
        <div className={styles.buttonRow}>
          <LoginButton />
          <button className={styles.btn}>Sign up</button>
        </div>
      </div>
      <div className={`${styles.footer} text-xs`}>
        <a href='#' className={styles.link} rel='noreferrer'>
          Terms of use
        </a>
        <span className={styles.separator}>|</span>
        <a href='#' className={styles.link} rel='noreferrer'>
          Privacy policy
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
