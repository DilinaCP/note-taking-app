'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Header from '../../components/header/page';
import { useRouter } from 'next/navigation';

type Note = {
  _id: string;
  title: string;
  content: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
};

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/Login');
        return;
      }
      
      await axios.delete(`http://localhost:8080/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note. Please try again.');
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/Login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/notes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setNotes(response.data);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to load notes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [router]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#f6fff8] pb-16">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-[#31572c]">Loading notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f6fff8] pb-16">
      <Header />
      <div className="flex items-center justify-between max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-[#31572c]">My Notes</h1>
        <Link href="/components/NewNote">
          <button className="bg-[#31572c] hover:bg-[#4f772d] text-white px-5 py-2 rounded-lg shadow transition font-semibold">
            + Add Note
          </button>
        </Link>
      </div>
      
      {error && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        </div>
      )}

      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl px-4">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-xl mb-4">No notes found.</p>
            <Link href="/components/NewNote">
              <button className="bg-[#31572c] hover:bg-[#4f772d] text-white px-5 py-2 rounded-lg shadow transition font-semibold">
                Create your first note
              </button>
            </Link>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white shadow-lg rounded-2xl border-2 border-[#b7e4c7] p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl min-h-[260px]"
            >
              <h3 className="text-xl font-semibold text-[#31572c] mb-2 truncate">{note.title}</h3>
              <div className="text-gray-700 text-justify whitespace-pre-line overflow-hidden transition-all duration-300 ease-in-out flex-1 max-h-[8rem]">
                {note.content}
              </div>
              <div className="mt-4 flex space-x-2">
                <Link href={`/edit/${note._id}`}>
                  <button className="px-4 py-1 rounded-lg text-white font-medium bg-[#4f772d] border border-[#31572c] hover:bg-[#31572c] transition">
                    Edit
                  </button>
                </Link>
                <button
                  className="px-4 py-1 rounded-lg text-white font-medium bg-[#f4a259] border border-[#d37a3f] hover:bg-[#d37a3f] transition"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}