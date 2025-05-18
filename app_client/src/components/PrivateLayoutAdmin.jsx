import React, { useState } from 'react';
import Sidebar from './SidebarAdmin';
import NavbarComponent from './common/NavBar';
import Footer from './common/Footer';

function PrivateLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-grow-1 d-flex flex-column">
        <NavbarComponent toggleSidebar={toggleSidebar} />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default PrivateLayout;
