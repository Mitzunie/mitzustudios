'use client';

import ProjectCard from "@/components/Cards/ProjectCard";
import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";
import { FacebookLogo } from "@/components/Icons/Facebook";
import { TikTokIcon } from "@/components/Icons/TikTok";
import { DiscordIcon } from "@/components/Icons/Discord";
import { DarkBackground } from "@/components/magicui/dark-background";

export default function ProjectsPage() {
  const projects = [
    {
      title: "NEKOHELL",
      description: "Catálogo online de la tienda fisica de stickers, llaveros y más.",
      github: "https://github.com/MitzuStudios",
      website: "https://nekohello.store",
      image: "/Previews/NEKOHELL.png",
      frameworks: ["Next.js", "Tailwind CSS"],
      socialMedia: [
        { name: "Instagram", url: "https://www.instagram.com/nekohell.store", icon: <IGLogo /> },
        { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61577944083577", icon: <FacebookLogo /> },
        { name: "X", url: "https://x.com/NekoHellStore", icon: <XIcon /> },
        { name: "TikTok", url: "https://www.tiktok.com/@nekohell.store", icon: <TikTokIcon /> },
      ],
    },  
    {
      title: "R.E.P.O Bot",
      description: "Bot personalizado para R.E.P.O Latam | Español.",
      github: "https://github.com/MitzuStudios/R.E.P.O-Discord-Bot",
      website: "https://disboard.org/es/server/1345616453356879874",
      image: "/Previews/REPO.png",
      frameworks: ["JS", "Discord.js"],
      socialMedia: [
        { name: "Discord", url: "https://www.discord.com/invite/a3sJmeknnd", icon: <DiscordIcon /> },
      ],
    }, 
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-6">
            <h1 className="clean-heading-xl">
              Mis Proyectos
            </h1>
            <p className="clean-subtitle max-w-2xl mx-auto">
              Una colección de mis proyectos personales desarrollados bajo la marca MitzuStudios. 
              Cada uno representa mi exploración de diferentes tecnologías y conceptos.
            </p>
            
            {/* Simple Decorative Line with Purple */}
            <div className="flex justify-center pt-4">
              <div className="w-24 h-0.5 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                github={project.github}
                website={project.website}
                image={project.image}
                frameworks={project.frameworks}
                socialMedia={project.socialMedia}
                className="w-full transform transition-all duration-300 hover:scale-105"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="clean-card p-10 space-y-6">
            <h2 className="clean-heading-lg">
              ¿Interesado en mi trabajo?
            </h2>
            <p className="clean-subtitle">
              Puedes explorar el código de mis proyectos en GitHub o seguir mis actualizaciones 
              para ver en qué estoy trabajando actualmente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                className="clean-button"
                onClick={() => window.open("https://github.com/MitzuStudios", "_blank")}
              >
                Ver GitHub
              </button>
              <button 
                className="clean-button-outline"
                onClick={() => window.open("https://x.com/mitzustudios_cl", "_blank")}
              >
                Seguir Actualizaciones
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
