"use client";

import Link from "next/link";
import { JSX } from "react";
import useAge from "@/lib/ageCalculator/script";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TeamCardProps {
  name: string;
  role: string;
  birthdate: [number, number, number];
  description: string;
  image?: string;
  socialMedia?: { name: string; url: string; icon: JSX.Element }[];
}

export default function TeamCard({
  name,
  role,
  birthdate,
  description,
  image,
  socialMedia,
}: TeamCardProps) {
  const [day, month, year] = birthdate;
  const age = useAge(year, month, day);

  const generateAvatar = () => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=e85d04&color=fff&size=200&font-size=0.6`;
  };

  const router = useRouter();

  return (
    <div className="tribal-card group cursor-pointer" onClick={() => router.push(`/staff/${name.toLowerCase()}`)}>
      {/* Profile Image Section */}
      <div className="relative h-56 overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-tribal-primary/20 to-tribal-secondary/20"></div>
        <Image
          src={image || generateAvatar()}
          width={200}
          height={200}
          alt={`${name} Image`}
          unoptimized
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Role Badge */}
        <div className="absolute top-4 left-4">
          <span className="tribal-tag bg-tribal-primary/90 text-primary-foreground border-0 font-semibold">
            {role}
          </span>
        </div>
        
        {/* Age Badge */}
        <div className="absolute top-4 right-4">
          <span className="tribal-tag bg-card/90 text-foreground border-border/50 font-medium">
            {age} años
          </span>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <h3 className="tribal-heading-md tribal-accent-line">{name}</h3>
          <p className="tribal-subtitle leading-relaxed">
            {description}
          </p>
        </div>

        {/* Social Media Section */}
        {socialMedia && socialMedia.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex justify-center space-x-3">
              {socialMedia.map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  className="tribal-social-icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-5 h-5">{social.icon}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Interaction Hint */}
        <div className="text-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-muted-foreground">
            Click para ver perfil completo
          </span>
        </div>
      </div>
    </div>
  );
}
