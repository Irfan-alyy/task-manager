'use client';

import { useAuth } from '@/context/authcontext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl font-extrabold text-gray-800 hover:text-blue-600 transition-colors duration-300">
            Task Manager
          </Link>
        </motion.div>

        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : !isAuthenticated ? (
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/signup"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/tasks"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Tasks
              </Link>
              <Link
                href="/add-task"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Add Task
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className="sm:hidden overflow-hidden"
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="flex flex-col items-center gap-4 py-4 bg-white shadow-md">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : !isAuthenticated ? (
            <>
              <Link
                href="/signup"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
                onClick={toggleMenu}
              >
                Register
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/tasks"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
                onClick={toggleMenu}
              >
                Tasks
              </Link>
              <Link
                href="/add-task"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
                onClick={toggleMenu}
              >
                Add Task
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
                onClick={toggleMenu}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
}