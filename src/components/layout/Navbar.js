import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../contexts/DBContext';
import '../../styles/Navbar.scss';

const Navbar = () => {
  const [logInOut, setLogInOut] = useState('Log In');
  const [location, setLocation] = useState('');

  const { currentUser, logOut } = useAuth();
  const { selectFolder } = useDB();

  const currentLocation = useLocation();

  useEffect(() => {
    setLocation(currentLocation.pathname);
  }, [currentLocation.pathname]);

  // Sets link text to Log In or Log Out depending on if user is logged in
  const setLinkText = useCallback(() => {
    if (currentUser == null) {
      setLogInOut('Log In');
    } else {
      setLogInOut('Log Out');
    }
  }, [currentUser]);

  useEffect(() => {
    setLinkText();
  }, [currentUser, setLinkText]);

  const handleLogOut = async () => {
    if (logInOut === 'Log Out') {
      await logOut();
    }
  };

  return (
    <header className='navbar'>
      <div className='flex-center'>
        <i className='fa fa-fire fa-2x logo'></i>
        <Link
          className='navbar__logo'
          to='/'
          onClick={() => {
            selectFolder('root');
          }}>
          filefire
        </Link>
      </div>
      <ul className='navbar__links'>
        <li className='navbar__links-link'>
          <Link to='/account'>
            {currentUser && location !== '/account' ? 'My Account' : undefined}
          </Link>
        </li>
        {location === '/account' && (
          <li className='navbar__links-link'>
            <Link to='/'>Dashboard</Link>
          </li>
        )}
        <li className='navbar__links-link'>
          <Link to='/login' onClick={handleLogOut}>
            {logInOut}
          </Link>
        </li>
        {!currentUser && (
          <li className='navbar__links-link'>
            <Link to='/signup'>Sign Up</Link>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Navbar;
