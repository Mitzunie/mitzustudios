'use client';

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/Icons/Github";
import Link from "next/link";
import { JSX } from "react";
import { BorderBeam } from "@/components/magicui/border-beam"; // Importar BorderBeam

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
    <Card className={`relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <BorderBeam
        duration={5}
        size={400}
        className="from-transparent via-purple-500 to-transparent"
      />
      <BorderBeam
        duration={5}
        delay={3}
        size={400}
        className="from-transparent via-purple-500 to-transparent"
      />

      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      ></div>

      <div className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
        </CardHeader>

        {description && (
          <p className="text-foreground text-sm">
            {description}
          </p>
        )}

        {frameworks && frameworks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-foreground">Frameworks utilizados:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {frameworks.map((framework, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-background text-foreground rounded-full"
                >
                  {framework}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <CardFooter className="p-6 flex justify-between items-center">
        <Link href={website} passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer">
            <Button variant={"primary"}>
              Sitio Web
            </Button>
          </a>
        </Link>

        <div className="flex space-x-4">
          <Link href={github} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" className="text-foregorund hover:text-gray-900 transition-colors duration-300">
              <GithubIcon />
            </a>
          </Link>

          {socialMedia?.map((social, index) => (
            <Link
              key={index}
              href={social.url}
              passHref
              legacyBehavior
            >
              <a target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-gray-900 transition-colors duration-300">
                {social.icon}
              </a>
            </Link>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}