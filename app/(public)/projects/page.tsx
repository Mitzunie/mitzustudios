import ProjectCard from "@/components/Cards/ProjectCard";
import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";
import { GithubIcon } from "@/components/Icons/Github";
import { FacebookLogo } from "@/components/Icons/Facebook";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function ProjectsPage() {
  const projects = [
    {
      title: "ONI WORKSHOP",
      description: "Tienda online de vinilos y decals personalizados",
      github: "https://github.com/mitzustudios",
      website: "https://oppaisoft.store",
      image: "/OniWorkshop.png",
      frameworks: ["Next.js", "Tailwind CSS"],
      socialMedia: [
        { name: "Instagram", url: "https://www.instagram.com/oniworkshop", icon: <IGLogo /> },
      ],
    },
    {
        title: "MitzuStudios Web",
        description: "Esta pagina web que estas viendo actualmente.",
        github: "https://github.com/mitzustudios",
        website: "https://www.mitzustudios.tech/",
        image: "/MitzuStudiosPage.png",
        frameworks: ["Next.js", "Tailwind CSS"],
        socialMedia: [
          { name: "Instagram", url: "https://www.instagram.com/mitzustudios_cl", icon: <IGLogo /> },
          { name: "X", url: "https://x.com/mitzustudios_cl", icon: <XIcon /> },
        ],
      },
 
  ];

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">Nuestros Proyectos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              className="hover:scale-105 shadow-lg hover:shadow-xl transition-transform duration-300"
              key={index}
              title={project.title}
              description={project.description}
              github={project.github}
              website={project.website}
              image={project.image}
              frameworks={project.frameworks}
              socialMedia={project.socialMedia}
            />
          ))}
        </div>
      </section>
    </main>
  );
}