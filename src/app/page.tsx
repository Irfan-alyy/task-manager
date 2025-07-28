'use client';


import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/authcontext';

export default function Page() {
  const { user, loading } = useAuth();
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center py-30 justify-center min-h-screen text-center px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {user ? `Welcome Back, ${user.user.username || user.user.email}!` : 'Welcome to My App'}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {user
            ? 'Manage your tasks with ease and stay productive.'
            : 'A modern Next.js application to organize your tasks efficiently. Sign in to get started!'}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {user ? (
            <Link
              href="/tasks"
              className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              View Your Tasks
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-block bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Use Our App?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="p-6 bg-gray-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Organize Tasks</h3>
              <p className="text-gray-600">Keep track of your tasks with a clean and intuitive interface.</p>
            </motion.div>
            <motion.div
              className="p-6 bg-gray-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Stay Productive</h3>
              <p className="text-gray-600">Prioritize your work and boost productivity with ease.</p>
            </motion.div>
            <motion.div
              className="p-6 bg-gray-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Secure & Fast</h3>
              <p className="text-gray-600">Built with Next.js and secure authentication for a seamless experience.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
      </footer>
    </div>
  );
}