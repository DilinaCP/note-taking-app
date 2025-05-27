/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Note = {
  _id: string;
  title: string;
  content: string;
  user: {
    _id: string;
    name: string;
  };
};

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params?.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data as { data: Note };
        const noteData = data.data; 
        setNote(noteData);
        setTitle(noteData.title || '');
        setContent(noteData.content || '');
      } catch (error) {
        console.error('Error fetching note:', error);
        setError('Failed to load note. It may not exist or you may not have permission.');
      } finally {
        setIsLoading(false);
      }
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId, router]);

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
        router.push('/auth/login');
        return;
      }

      await axios.put(
        `http://localhost:8080/api/notes/${noteId}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      router.push('/components/homepage');
    } catch (error: any) {
      console.error('Error updating note:', error);
      setError(error.response?.data?.message || 'Failed to update note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
        <div className="text-center text-[#31572c]">Loading note...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
        <div className="text-red-500">{error || 'Note not found.'}</div>
        <button
          onClick={() => router.push('/components/newnotelist')}
          className="mt-4 px-4 py-2 rounded-lg text-white font-medium bg-[#4f772d] hover:bg-[#31572c] transition"
        >
          Back to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-[#31572c]">Edit Note</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="edit-title"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4f772d]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="edit-content"
          className="w-full h-64 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4f772d]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
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
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
