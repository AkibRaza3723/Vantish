import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import CreatePostModal from './CreatePostModal';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <Navbar onPostClick={() => setIsPostModalOpen(true)} />
      <main className="app-container">
        {/* We use a grid layout only on Home for the 3 columns, other pages have different layouts */}
        {location.pathname === '/' ? (
          children
        ) : (
          <div style={{ maxWidth: '1128px', width: '100%', padding: '0 16px' }}>
            {children}
          </div>
        )}
      </main>
      
      {isPostModalOpen && (
        <CreatePostModal onClose={() => setIsPostModalOpen(false)} />
      )}
    </>
  );
};

export default Layout;
