import TeamCard from "@/components/Cards/TeamCard";
import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Mitzunie",
      role: "Fundador",
      description: "Fundador de MitzuStudios y OniWorkshop",
      image: "/Team/mitzunie.gif",
      birthdate: [22, 11, 2005] as [number, number, number],
      socialMedia: [
        { name: "Twitter", url: "https://twitter.com/mitzustudios_cl", icon: <XIcon /> },
        { name: "Instagram", url: "https://www.instagram.com/mitzunii", icon: <IGLogo /> },
      ],
    },
    {
        name: "Conekitoo",
        role: "Diseñadora",
        description: "Diseñadora de MitzuStudios y OniWorkshop.",
        birthdate: [21, 10, 2003] as [number, number, number],
        socialMedia: [
            { name: "Instagram", url: "https://www.instagram.com/conekitooo/", icon: <IGLogo /> },
        ]
    }
  ];

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10">
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
      <section className="max-w-7xl mx-auto mt-20">
        <h1 className="text-4xl font-extrabold text-center mb-8">Nuestro Equipo</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <TeamCard
              key={index}
              name={member.name}
              role={member.role}
              description={member.description}
              birthdate={member.birthdate}
              image={member.image}
              socialMedia={member.socialMedia}
            />
          ))}
        </div>
      </section>
    </main>
  );
}