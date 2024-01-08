import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../Context/auth-context';
import './MainNavigation.css';

const MainNavigation = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    context.logout();
    navigate('/auth');
  };

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!context.token && (
            <li>
              <Link to="/auth">Authenticate</Link>
            </li>
          )}
          <li>
            <Link to="/events">Events</Link>
          </li>
          {context.token && (
            <>
              <li>
                <Link to="/bookings">Bookings</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
