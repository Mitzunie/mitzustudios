"use client";

import useAge from "@/lib/ageCalculator/script";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";

const staffMember = {
  name: "Mitzunie",
  birthDate: { day: 22, month: 11, year: 2005 },
  description: "Fundador de MitzuStudios y OniWorkshop.",
  socialMedia: [
    { name: "Twitter", url: "https://twitter.com/mitzustudios_cl", icon: <XIcon /> },
    { name: "Instagram", url: "https://www.instagram.com/mitzunii", icon: <IGLogo /> },
  ],
  cv: "",   
  image: "/Team/mitzunie.gif",
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
          <Image
            src={staffMember.image || generateAvatar()}
            alt={staffMember.name}
            width={120}
            height={100}
            unoptimized
            className=" rounded-full border-4 border-gray-300 dark:border-gray-700 mb-4"
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