'use client';

import React, { useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Header from "../../components/header/page";
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    remember: false 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('https://note-taking-app-i2uk.onrender.com/api/user/login', { email, password });
      const data = res.data as { token?: string };
      if (data.token) {
        localStorage.setItem('token', data.token); 
        toast.success("Login successful!");
        router.push('/components/homepage');
      } else {
        toast.error("No token received");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
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
          <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: '#31572c' }}>Welcome back</h2>
          <p className="text-sm mb-6 text-center" style={{ color: '#5b8e7d' }}>Login to continue to Petalpad</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;