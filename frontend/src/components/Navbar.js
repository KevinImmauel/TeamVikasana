"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import Cookies from 'js-cookie';


const checkUserAuth = () => {
  if (typeof window !== 'undefined') {
    // Check localStorage for user data
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      try {
        return JSON.parse(userFromLocalStorage);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        // Return null if JSON parsing fails
        return null;
      }
    }

    // Check cookies for user data if necessary
    const userFromCookies = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
    if (userFromCookies) {
      const cookieValue = userFromCookies.split('=')[1];
      try {
        return JSON.parse(cookieValue);
      } catch (error) {
        console.error("Error parsing user from cookies:", error);
        // Return null if JSON parsing fails
        return null;
      }
    }
  }
  return null;
};


export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);




  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Check user auth status on initial render
  useEffect(() => {
    const authenticatedUser = checkUserAuth();
    setUser(authenticatedUser);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Beats', href: '/dashboard/beats' },
    { name: 'Incidents', href: '/dashboard/incidents' },
    { name: 'SOS', href: '/dashboard/sos' },
    { name: 'Analytics', href: '/dashboard/analytics' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${isScrolled
      ? 'bg-white/90 dark:bg-dark-400/90 backdrop-blur-md shadow-soft dark:shadow-soft-dark'
      : 'bg-white dark:bg-dark-400'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">

            {!Cookies.get('token') ? (
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold">PD</span>
                </div>
                <span className="font-bold text-xl text-primary-800 dark:text-primary-100">
                  Police Department
                </span>
              </Link>
            ) : null}

          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">


            {/* Conditional Render: Show Login or Logout */}
            {!Cookies.get('token') ? (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-100"
              >
                Login
              </Link>
            ) : null}

          </div>

          {/* Mobile Navigation Menu */}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg dark:shadow-none bg-white dark:bg-dark-300">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.href || pathname?.startsWith(item.href + '/')
                ? 'text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30'
                : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800/50'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Conditional Render for Mobile Menu: Login/Logout */}
          {!user ? (
            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-800">
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
