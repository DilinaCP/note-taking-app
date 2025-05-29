'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '../../components/header/page';
import axios from 'axios';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
    const { fullName, email, password } = formData;
      await axios.post('https://note-taking-app-i2uk.onrender.com/api/user', { fullName, email, password });
      toast.success('Signup successful!');
      router.push('/auth/login/');
    } catch (error) {
      console.error(error);
      toast.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f7f4' }}>
      <Header />
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg"
             style={{ 
               backgroundColor: '#ffffff',
               border: '2px solid #5b8e7d',
               borderRadius: '12px'
             }}>
          <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: '#31572c' }}>Create an account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              value={formData.fullName} 
              onChange={handleChange} 
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: '1px solid #90a955',
                backgroundColor: '#f8f9fa'
              }}
              required
            />
            
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: '1px solid #90a955',
                backgroundColor: '#f8f9fa'
              }}
              required
            />
            
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: '1px solid #90a955',
                backgroundColor: '#f8f9fa'
              }}
              required
              minLength={6}
            />
            
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: '1px solid #90a955',
                backgroundColor: '#f8f9fa'
              }}
              required
              minLength={6}
            />
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-2 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: isLoading ? '#adb5bd' : '#4f772d',
                color: 'white',
                border: isLoading ? 'none' : '2px solid #31572c'
              }}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;