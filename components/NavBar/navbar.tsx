'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/Themes/ThemeToggle';
import { Logo } from '@/components/Icons/Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="backdrop-blur-sm py-3 fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <Link href="/">
          <Logo className="cursor-pointer w-10 h-10" />
        </Link>

        <Link href="/">
        <span className="text-xl font-bold text-foreground cursor-pointer">
          MitzuStudios
        </span>
      </Link> 
      </div>

        {/* Botón Menú Hamburguesa */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navegación */}
        <nav
          className={`md:relative md:flex bg-background backdrop-blur-sm w-full md:w-auto fixed md:static top-0 left-0 h-screen md:h-auto p-6 md:p-0 transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="md:hidden flex justify-between items-center mb-6">
            <span className="text-lg font-bold ml-2">MITZUSTUDIOS</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-foregorund mr-6">
              <X size={28} />
            </button>
          </div>

          <ul className="flex flex-col md:flex-row md:space-x-6 text-lg w-full">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left md:text-md text-foregorund">
                  Inicio
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/projects" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left md:text-md text-foregorund">
                  Proyectos
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left md:text-md text-foregorund">
                  Contactanos
                </Button>
              </Link>
            </li>
            <li className="mt-4 md:mt-0 flex justify-center md:justify-start">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
