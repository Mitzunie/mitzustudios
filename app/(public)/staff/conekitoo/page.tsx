"use client";

import useAge from "@/lib/ageCalculator/script";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Link from "next/link";

import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";
import { LinkedinIcon } from "@/components/Icons/Linkedin";
import { YoutubeLogo } from "@/components/Icons/Youtube";
import { DiscordIcon } from "@/components/Icons/Discord";
import { GithubIcon } from "@/components/Icons/Github";

const staffMember = {
    name: "Conekitoo",
    role: "Diseñadora",
    description: "Diseñadora de MitzuStudios",
    birthDate: { day: 21, month: 10, year: 2003 },
    socialMedia: [
        { name: "Instagram", url: "https://www.instagram.com/conekitooo/", icon: <IGLogo /> },
    ],
  cv: "",
  image: "",
};

export default function StaffProfile() {
  const age = useAge(staffMember.birthDate.year, staffMember.birthDate.month, staffMember.birthDate.day);

  const generateAvatar = () => {
    const initials = staffMember.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="flex flex-col items-center">
          <img
            src={staffMember.image || generateAvatar()}
            alt={staffMember.name}
            className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-700 mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{staffMember.name}</h1>
          <p className="text-gray-500 text-lg mt-2">Edad: {age} años</p>
        </div>

        <p className="mt-6 text-gray-700 dark:text-gray-200 text-center">
          {staffMember.description}
        </p>

        <div className="mt-6 flex justify-center space-x-4">
          {staffMember.socialMedia.map((social, i) => (
            <Button
              key={i}
              onClick={() => window.open(social.url)}
              variant={"ghost"}
            >
              {social.icon}{" "}{social.name}
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
        <Link href={staffMember.cv} download>
            <Button variant={"primary"} disabled={!staffMember.cv}>
              <FileDown size={24} className="mr-2" />
              Descargar CV
            </Button>
        </Link>
      </div>
    </main>
  );
}