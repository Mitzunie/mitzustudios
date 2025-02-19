'use client';
import '../styles/404.css';

import React from 'react';

const Error404: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen text-white font-mono bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center relative z-10">
        <h1 className="text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 neon-text custom-animate-pulse">
          404
        </h1>

        <p className="text-2xl mb-8 text-gray-300">
          Te has perdido en el espacio
        </p>

        <p className="text-lg mb-4 text-gray-400">
          La página que buscas no existe
        </p>

        <div className="mb-8">
          <p className="text-sm text-gray-400">
            ¿Buscas inspiración para tu próximo proyecto?
          </p>
          <p className="text-sm text-gray-400">
            Revisa nuestros proyectos {' '}
            <a href="/" className="text-cyan-400 hover:underline neon-text">
              aquí
            </a>
          </p>
        </div>

        <a
          href="/"
          className="inline-block px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-all animated-button"
        >
          Regresar a la página principal
        </a>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-neon opacity-50"></div>
      </div>
    </div>
  );
};

export default Error404;