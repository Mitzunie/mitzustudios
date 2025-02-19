'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { TextAnimate } from "@/components/magicui/text-animate";
import { Particles } from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Home() {

  const router = useRouter();

  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");
 
  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <main className="mb-12">
      <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
         />

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

    </main>
  );
}
