'use client';

import Link from 'next/link';
import { Logo } from '@/components/Icons/Logo';
import { FacebookLogo } from '@/components/Icons/Facebook';
import { XIcon } from "@/components/Icons/Twitter";
import { GithubIcon } from "@/components/Icons/Github";
import { IGLogo } from "@/components/Icons/Instagram";

const Footer = () => {
  return (
    <footer className="relative bg-background/95 backdrop-blur-xl text-foreground border-t border-border">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <Logo className="w-16 h-16 text-primary transition-all duration-200 group-hover:scale-105" />
            </div>
            <div>
              <h2 className="clean-heading-md text-foreground">
                MitzuStudios
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                © {new Date().getFullYear()} Todos los derechos reservados.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <nav className="flex space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Inicio
              </Link>
              <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Proyectos
              </Link>
            </nav>

            {/* Social Media */}
            <div className="flex space-x-3">
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="clean-social-icon">
                <FacebookLogo className="w-5 h-5" />
              </Link>
              <Link href="https://x.com/mitzustudios_cl" target="_blank" aria-label="Twitter" className="clean-social-icon">
                <XIcon className="w-5 h-5" />
              </Link>
              <Link href="https://www.instagram.com/mitzustudios_cl/" target="_blank" aria-label="Instagram" className="clean-social-icon">
                <IGLogo className="w-5 h-5" />
              </Link>
              <Link href="https://github.com/MitzuStudios" target="_blank" aria-label="GitHub" className="clean-social-icon">
                <GithubIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-24 h-0.5 bg-primary rounded-full"></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Desarrollando proyectos personales con pasión y tecnología moderna
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
