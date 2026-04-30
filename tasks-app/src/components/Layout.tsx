import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav>
          <Link to="/" className="nav-logo">TaskMaster</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
          </div>
        </nav>
      </header>
      <main className="app-content">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} TaskMaster Assessment Template</p>
      </footer>
    </div>
  );
};
