'use client';

import Link from 'next/link';
import { Logo } from '@/components/Icons/Logo';
import { FacebookLogo } from '@/components/Icons/Facebook';
import { XIcon } from "@/components/Icons/Twitter";
import { GithubIcon } from "@/components/Icons/Github";
import { IGLogo } from "@/components/Icons/Instagram";
import { redirect } from 'next/navigation';

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-6 border-t">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo y Derechos */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Logo className="w-20 h-20" />
          <div>
            <h2 className="text-xl font-bold">MitzuStudios</h2>
            <p className="text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
            <FacebookLogo className="w-5 h-5 hover:text-blue-500" />
          </Link>
          <Link href="https://x.com/mitzustudios_cl" target="_blank" aria-label="Twitter">
            <XIcon className="w-5 h-5 hover:text-blue-400" />
          </Link>
          <Link href="https://www.instagram.com/mitzustudios_cl/" target="_blank" aria-label="Instagram">
            <IGLogo className="w-5 h-5 hover:text-pink-500" />
          </Link>
          <Link href="https://github.com/MitzuStudios" target="_blank" aria-label="GitHub">
            <GithubIcon className="w-5 h-5 hover:text-gray-400" />
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
