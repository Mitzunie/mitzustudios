import ProjectCard from "@/components/Cards/ProjectCard";
import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export default function ProjectsPage() {
  const projects = [
    {
      title: "ONI WORKSHOP",
      description: "Tienda online de vinilos y decals personalizados",
      github: "https://github.com/MitzuStudios/OniWorkshop",
      website: "https://oppaisoft.store",
      image: "/Previews/OniWorkshop.png",
      frameworks: ["Next.js", "Tailwind CSS"],
      socialMedia: [
        { name: "Instagram", url: "https://www.instagram.com/oniworkshop", icon: <IGLogo /> },
      ],
    },  
  ];

  return (
    <main className="min-h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 pt-24">
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
      </div>
    </main>
  );
}