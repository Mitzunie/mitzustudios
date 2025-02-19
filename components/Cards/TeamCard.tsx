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
    return `https://ui-avatars.com/api/?name=${initials}`;
  };

  const router = useRouter();

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer" onClick={() => router.push(`/staff/${name.toLowerCase()}`)}>
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <Image
          src={image || generateAvatar()}
          width={200}
          height={200}
          alt={`${name} Image`}
          unoptimized
          className="w-full h-full object-cover"
        />
    
        <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {role}
        </span>
      </div>

      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
  
        <p className="text-md font-semibold text-gray-700 dark:text-gray-300 mt-1">{age} años</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{description}</p>

        {socialMedia && (
          <div className="mt-4 flex justify-center space-x-4">
            {socialMedia.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
