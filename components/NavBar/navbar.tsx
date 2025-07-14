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
    <header className="backdrop-blur-xl py-4 fixed w-full z-50 bg-background/90 border-b border-border">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 group">
          <Link href="/" className="flex items-center space-x-4">
            <div className="relative">
              <Logo className="w-12 h-12 transition-all duration-200 group-hover:scale-105 text-primary" />
            </div>
            <span className="clean-heading-md text-foreground">
              MitzuStudios
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden clean-social-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation */}
        <nav
          className={`md:relative md:flex bg-background/95 md:bg-transparent backdrop-blur-xl w-full md:w-auto fixed md:static top-0 left-0 h-screen md:h-auto p-6 md:p-0 transition-all duration-300 ${
            isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100'
          }`}
        >
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-8 pb-6 border-b border-border">
            <span className="clean-heading-md text-foreground">MITZUSTUDIOS</span>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="clean-social-icon"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-6 md:space-y-0">
            <li>
              <Link
                href="/"
                className="relative block text-center text-foreground font-medium text-base transition-all duration-200 hover:text-muted-foreground group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">Inicio</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></div>
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="relative block text-center text-foreground font-medium text-base transition-all duration-200 hover:text-muted-foreground group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">Proyectos</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></div>
              </Link>
            </li>
            <li className="md:ml-4">
              <div className="flex justify-center md:justify-start">
                <ThemeToggle />
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Simple Scroll Progress with Purple */}
      <ScrollProgress className="top-[81px] h-1 bg-primary" />
    </header>
  );
};

export default Navbar;
