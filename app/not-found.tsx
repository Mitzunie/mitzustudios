'use client';
import '../styles/404.css';
import Link from 'next/link';

import React from 'react';

const Error404: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen text-black dark:text-white font-mono">
      <div className="text-center relative z-10">
        <h1 className="text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 neon-text custom-animate-pulse">
          404
        </h1>

        <p className="text-2xl mb-8 text-primary">
          Te has perdido en el espacio
        </p>

        <p className="text-lg mb-4 text-primary">
          La página que buscas no existe o ha sido movida a otra dimensión.
        </p>

        <div className="mb-8">
          <p className="text-sm text-primary">
            ¿Buscas crear tu proyecto?
          </p>
          <p className="text-sm text-primary">
            Revisa {' '}
            <Link href="https://neenbyss.com" className="text-purple-600 dark:text-purple-400 hover:underline neon-text">
              Neenbyss
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-purple-400 text-white font-semibold rounded-lg hover:bg-purple-500 transition-all animated-button"
        >
          Regresar a la página principal
        </Link>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-neon opacity-50"></div>
      </div>
    </div>
  );
};

export default Error404;
