import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './Login.module.css';

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className={styles.btn} onClick={() => loginWithRedirect()}>
      Log In
    </button>
  );
};

export default LoginButton;
