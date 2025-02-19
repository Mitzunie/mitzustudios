'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { TextAnimate } from "@/components/magicui/text-animate";
import PartnerCard from "@/components/Cards/PartnersCard";
import { IGLogo } from "@/components/Icons/Instagram";
import { XIcon } from "@/components/Icons/Twitter";
import { LinkedingIcon } from "@/components/Icons/Linkedin";
import { YoutubeLogo } from "@/components/Icons/Youtube";
import { DiscordIcon } from "@/components/Icons/Discord";

export default function Home() {

  const router = useRouter();

  return (
    <main>
      <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        <section className="relative z-10 flex flex-col items-center text-center px-4" id="hero">
          <TextAnimate as="h1" animation="slideRight" className="text-4xl md:text-6xl font-extrabold">
            MITZUSTUDIOS
          </TextAnimate>
          <TextAnimate as="h2" animation="slideLeft" className="text-sm md:text-md font-extrabold text-center mt-2">
            Construyendo hoy el futuro que imagino para mañana
          </TextAnimate>
          
          <div className="mt-4 flex space-x-4">
              <Button className="text-sm md:text-md" variant={"primary"} onClick={() => router.push("/projects")}>Ver Portafolio</Button>
              <Button className="text-sm md:text-md" variant={"primary"} onClick={() => router.push("/contact")}>Contacto</Button>
          </div>
        </section>
      </div>

      <section className="w-full flex flex-col items-center mt-12 px-4" id="aboutme">
        <TextAnimate as="h1" animation="slideUp" className="text-3xl md:text-4xl font-extrabold text-center">
          SOBRE NOSOTROS
        </TextAnimate>
        <p className="text-center text-sm md:text-md font-regular mt-6 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
          {`Bienvenidos a MitzuStudios, una empresa dedicada a la administración y gestión de comercios innovadores. Nuestra misión es proporcionar soluciones eficientes y creativas para impulsar el éxito de nuestros clientes.

Oni Workshop es uno de nuestros principales proyectos, donde combinamos arte y tecnología para ofrecer productos únicos y de alta calidad. Además, estamos expandiendo nuestros horizontes con planes futuros para incluir servicios de desarrollo web, ayudando a empresas a establecer y mejorar su presencia en línea.

En MitzuStudios, creemos en la innovación constante y en la creación de valor a través de la colaboración y el compromiso con la excelencia. Nuestro equipo está compuesto por profesionales apasionados y expertos en sus campos, listos para enfrentar cualquier desafío y convertir ideas en realidades.

Únete a nosotros en este emocionante viaje y descubre cómo podemos ayudarte a alcanzar tus metas.`}
        </p>
      </section>

      <section id="projects" className="w-full flex flex-col items-center mt-12 px-4">
        <TextAnimate as="h1" animation="slideUp" className="text-3xl md:text-4xl font-extrabold text-center">
          NUESTROS SOCIOS
        </TextAnimate>
        <div className="w-full mx-4 md:mx-20 lg:mx-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 mb-6">
           <PartnerCard
           description="Zeew Space es una pagina donde puedes encontrar los mejores cursos de programación y diseño web."
           logo="ZeewSpaceLogo.webp"
           name="Zeew Space"
           website="https://www.zeew.space/"
           socialMedia={[
            { name: "Instagram", url: "https://www.instagram.com/zeewspace/", icon: <IGLogo /> },
            { name: "Youtube", url: "https://www.youtube.com/@zeewspace", icon: <YoutubeLogo /> },
            { name:"Discord", url: "https://discord.com/invite/TbB88pnH3w", icon: <DiscordIcon /> },
            { name: "Linkedin", url: "https://www.linkedin.com/company/zeewspace/", icon: <LinkedingIcon /> },
           ]}/>
           <PartnerCard
           description="Neenbyss es una empresa de desarrollo web, Fivem, Aplicaciones, entre otros tipos de desarrollo."
           logo="NB_ICON.svg"
           name="NEENBYSS"
           website="https://www.neenbyss.com/"
           socialMedia={[
              { name: "X", url: "https://x.com/neenbyss", icon: <XIcon /> },
              { name: "Linkedin", url: "https://www.linkedin.com/company/neenbyss/?originalSubdomain=mx", icon: <LinkedingIcon /> },
           ]}/>
          </div>
        </div>
      </section>
    </main>
  );
}