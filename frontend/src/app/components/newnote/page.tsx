/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function NewNote() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        'https://note-taking-app-i2uk.onrender.com/api/notes',
        { title, content },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        router.push('/components/homepage');
      }
    } catch (err: any) {
      console.error('Failed to save note:', err);
      setError(err.response?.data?.message || 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-3xl mx-auto mt-10 p-6 rounded-2xl shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-[#31572c]">Write a New Note</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4f772d]"
          style={{
            borderColor: '#90a955',
            backgroundColor: '#f8f9fa',
          }}
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          className="w-full h-64 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4f772d]"
          style={{
            borderColor: '#90a955',
            backgroundColor: '#f8f9fa',
          }}
          placeholder="Write your note content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => router.push('/components/newnotelist')}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg text-[#31572c] font-medium bg-white border border-[#31572c] hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            isLoading ? 'bg-[#90a955] cursor-not-allowed' : 'bg-[#4f772d] hover:bg-[#31572c]'
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </div>
  );
}