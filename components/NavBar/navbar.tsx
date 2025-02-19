'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/Themes/ThemeToggle';
import { Logo } from '@/components/Icons/Logo';
import { ScrollProgress } from "@/components/magicui/scroll-progress";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="backdrop-blur-lg py-3 fixed w-full z-50 bg-background/90 border-b border-gray-300 dark:border-gray-700 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
   
        <div className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-300">
          <Link href="/">
            <Logo className="cursor-pointer w-10 h-10 transition-transform duration-300 hover:scale-110" />
          </Link>
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">
              MitzuStudios
            </span>
          </Link>
        </div>

        {/* Botón de menú en dispositivos móviles */}
        <button
          className="md:hidden text-primary hover:text-primary/80 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav
          className={`md:relative md:flex bg-background md:bg-transparent backdrop-blur-lg w-full md:w-auto fixed md:static top-0 left-0 h-screen md:h-auto p-6 md:p-0 transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="md:hidden flex justify-between items-center mb-6">
            <span className="text-lg font-bold ml-2 text-foreground">MITZUSTUDIOS</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors duration-300">
              <X size={28} />
            </button>
          </div>

          <ul className="flex flex-col md:flex-row md:space-x-6 text-lg w-full items-center justify-center md:justify-end">
            <li>
              <Link
                href="/"
                className="relative block py-2 md:py-0 text-center text-sm font-semibold text-foreground transition-colors duration-300 hover:text-primary after:block after:content-[''] after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 after:hover:w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="relative block py-2 md:py-0 text-center text-sm font-semibold text-foreground transition-colors duration-300 hover:text-primary after:block after:content-[''] after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 after:hover:w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Proyectos
              </Link>
            </li>
            <li>
              <Link
                href="/staff"
                className="relative block py-2 md:py-0 text-center text-sm font-semibold text-foreground transition-colors duration-300 hover:text-primary after:block after:content-[''] after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 after:hover:w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Personal
              </Link>
            </li>
            <li className="mt-4 md:mt-0 flex justify-center md:justify-start">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>

      <ScrollProgress className="top-[65px]" />
    </header>
  );
};

export default Navbar;
