import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header
      className="w-full py-4 px-6 shadow-sm"
      style={{
        backgroundColor: '#4f772d', 
        borderBottom: '3px solid #31572c', 
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="" passHref>
          <h1
            className="text-3xl font-extrabold tracking-wide cursor-pointer"
            style={{ color: '#ecf39e' }} 
          >
            PetalPad
          </h1>
        </Link>

        <nav className="flex space-x-8">
          <Link href="/auth/login" passHref>
            <span
              className="cursor-pointer text-base font-medium transition hover:underline"
              style={{ color: '#f4a259' }}
            >
              Login
            </span>
          </Link>
          <Link href="/" passHref>
            <span
              className="cursor-pointer text-base font-medium transition hover:underline"
              style={{ color: '#f4a259' }}
            >
              Sign Up
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
