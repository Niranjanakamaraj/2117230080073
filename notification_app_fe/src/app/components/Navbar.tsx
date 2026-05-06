"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">CampusNotifications</h1>
        <div className="navbar-links">
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            All Notifications
          </Link>
          <Link 
            href="/priority" 
            className={`nav-link ${pathname === '/priority' ? 'active' : ''}`}
          >
            Priority Inbox
          </Link>
        </div>
      </div>
    </nav>
  );
}
