import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

interface LogoutButtonProps {
  className: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const { logout } = useAuth0();

  return (
    <button
      className={className}
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <FontAwesomeIcon icon={faSignOut} color='black' size='lg' />
    </button>
  );
};

export default LogoutButton;
