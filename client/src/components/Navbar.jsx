import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Bell, User, Search, PlusSquare } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onPostClick }) => {
  const navList = (
    <ul className="nav-list">
      <li className="nav-item">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home className="nav-icon" size={24} />
          <span className="nav-text">Home</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/network" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users className="nav-icon" size={24} />
          <span className="nav-text">My Network</span>
        </NavLink>
      </li>
      <li className="nav-item mobile-only-nav">
        <button className="nav-link" onClick={onPostClick}>
          <PlusSquare className="nav-icon" size={24} />
          <span className="nav-text">Post</span>
        </button>
      </li>
      <li className="nav-item">
        <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell className="nav-icon" size={24} />
          <span className="nav-text">Notifications</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <User className="nav-icon" size={24} />
          <span className="nav-text">Me</span>
        </NavLink>
      </li>
    </ul>
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <div className="navbar-logo">
              <img src="/logo.png" alt="Linkout" className="logo-img" />
            </div>
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                placeholder="Search" 
                className="search-input"
              />
            </div>
          </div>
          
          <nav className="navbar-nav desktop-nav">
            {navList}
          </nav>
        </div>
      </header>

      <nav className="navbar-nav mobile-nav">
        {navList}
      </nav>
    </>
  );
};

export default Navbar;
