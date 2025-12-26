import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = true, 
  showFooter = true 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar toggleSidebar={showSidebar ? toggleSidebar : undefined} />

      {/* Horizontal Navigation Bar */}
      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;