import Link from 'next/link';
import { JSX } from 'react';
import { Button } from "@/components/ui/button";
import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";
import { FacebookLogo } from "@/components/Icons/Facebook";

interface PartnerCardProps {
  name: string;
  description: string;
  logo: string;
  website?: string;
  socialMedia?: { name: string; url: string; icon: JSX.Element }[];
}

export default function PartnerCard({ name, description, logo, website, socialMedia}: PartnerCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
      {/* Contenedor del logo con mejor proporción y fondo dinámico */}
      <div className="w-full h-56 flex items-center justify-center bg-card p-6">
        <img src={logo} alt={`${name} Logo`} className="max-h-40 max-w-full object-contain" />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>

        {/* Enlaces a redes sociales y sitio web */}
        <div className="mt-4 flex space-x-4 items-center">
          {website && (
            <Link href={website} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="text-sm">
                Visitar sitio
              </Button>
            </Link>
          )}

          {socialMedia && socialMedia.map((social, index) => (
            <Link key={index} href={social.url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                {social.icon}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
