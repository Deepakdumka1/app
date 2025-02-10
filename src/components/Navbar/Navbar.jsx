import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>CampusConnect</h1>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/events">Events</Link>
        <Link to="/resources">Resources</Link>
      </div>
    </nav>
  );
};

export default Navbar; 