
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GoogleIcon } from './icons';

const Login: React.FC = () => {
  const { loginWithGoogle, loginAsGuest } = useAuth();
  const [username, setUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
        setError('Please enter a username.');
        return;
    }
    if (!loginAsGuest(username, accessCode)) {
      setError('Invalid access code. Please try again.');
    } else {
        setError('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Shadow Fight Agent
          </h1>
          <p className="mt-2 text-gray-400">Your personal guide to the game's lore.</p>
        </div>
        
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
        >
          <GoogleIcon className="w-6 h-6" />
          Sign in with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or continue as guest</span>
          </div>
        </div>

        <form onSubmit={handleGuestLogin} className="space-y-4">
           <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
              placeholder="Enter a Username"
            />
          </div>
          <div>
            <label htmlFor="access-code" className="sr-only">
              Access Code
            </label>
            <input
              id="access-code"
              name="access-code"
              type="text"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setError('');
              }}
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
              placeholder="Enter Access Code"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
          >
            Enter as Guest
          </button>
        </form>
        <p className="text-center text-xs text-gray-500">
            Note: Guest chat history is not saved.
        </p>
      </div>
    </div>
  );
};

export default Login;
