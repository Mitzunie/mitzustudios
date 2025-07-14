'use client';

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/Icons/Github";
import Link from "next/link";
import { JSX } from "react";

interface ProjectCardProps {
  title: string;
  image: string;
  website: string;
  github: string;
  frameworks?: string[];
  socialMedia?: { name: string; url: string; icon: JSX.Element }[];
  description?: string;
  className?: string;
}

export default function ProjectCard({
  title,
  image,
  website,
  github,
  frameworks,
  socialMedia,
  description,
  className,
}: ProjectCardProps) {
  return (
    <div className={`project-card-enhanced group ${className} max-w-sm mx-auto`}>
      {/* Hero Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Floating Action Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Link href={website} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <button className="clean-button text-xs px-3 py-1.5 rounded-lg shadow-lg">
                Ver Sitio
              </button>
            </a>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-5">
        {description && (
          <div className="text-center">
            <p className="clean-subtitle text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
        )}

        {/* Frameworks Section */}
        {frameworks && frameworks.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 justify-center">
              {frameworks.map((framework, index) => (
                <span key={index} className="clean-tag text-xs px-3 py-1.5">
                  {framework}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Section - Enhanced */}
        {socialMedia && socialMedia.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
              Redes Sociales
            </h4>
            <div className="social-grid">
              {socialMedia.map((social, index) => (
                <Link key={index} href={social.url} passHref legacyBehavior>
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="clean-social-icon"
                    title={social.name}
                  >
                    <div className="w-5 h-5">{social.icon}</div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Section - Enhanced */}
        <div className="pt-4 border-t border-border">
          <div className="button-grid">
            <Link href={github} passHref legacyBehavior>
              <a target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="clean-button-outline w-full">
                  <GithubIcon className="w-4 h-4" />
                  Código
                </button>
              </a>
            </Link>

            <Link href={website} passHref legacyBehavior>
              <a target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="clean-button w-full">
                  Ver Sitio
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}