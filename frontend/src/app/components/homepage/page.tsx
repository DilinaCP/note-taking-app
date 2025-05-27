'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Header from '../header/page';

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

const NOTES_PER_PAGE = 8;

export default function Homepage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    axios.get('http://localhost:8080/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      const data = res.data as { data: Note[] };
      setNotes(data.data);
    })
  }, [router]);


  const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);
  const paginatedNotes = notes.slice(
    (page - 1) * NOTES_PER_PAGE,
    page * NOTES_PER_PAGE
  );


  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
        console.error(err);
      alert('Failed to delete note');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f6fff8] pb-16">
      <Header />
      <div className="flex items-center justify-between max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-[#31572c]">My Notes</h1>
        <Link href="/components/newnote">
          <button className="bg-[#31572c] hover:bg-[#4f772d] text-white px-5 py-2 rounded-lg shadow transition font-semibold">
            + Add Note
          </button>
        </Link>
      </div>
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl px-4">
        {paginatedNotes.length === 0 ? (
          <p className="text-gray-500 text-xl col-span-full text-center">No notes found.</p>
        ) : (
          paginatedNotes.map((note) => (
            <div
              key={note._id}
              className="bg-white shadow-lg rounded-2xl border-2 border-[#b7e4c7] p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl min-h-[260px]"
            >
              <h3 className="text-xl font-semibold text-[#31572c] mb-2 truncate">{note.title}</h3>
              <div
                className="text-gray-700 text-justify whitespace-pre-line overflow-hidden transition-all duration-300 ease-in-out flex-1 max-h-[8rem]"
              >
                {note.content}
              </div>
              <div className="mt-4 flex space-x-2">
                <Link href={`/edit/${note._id}`}>
                  <button
                    className="px-4 py-1 rounded-lg text-white font-medium bg-[#4f772d] border border-[#31572c] hover:bg-[#31572c] transition"
                  >
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
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-2">
          <button
            className="px-4 py-2 rounded-lg font-semibold transition"
            style={{
              backgroundColor: page === 1 ? '#d3d3d3' : '#90a955',
              color: page === 1 ? '#6c757d' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-3 py-2 text-[#31572c] font-medium">
            {page} / {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-lg font-semibold transition"
            style={{
              backgroundColor: page === totalPages ? '#d3d3d3' : '#90a955',
              color: page === totalPages ? '#6c757d' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}