'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { TextAnimate } from "@/components/magicui/text-animate";
import { DarkBackground } from "@/components/magicui/dark-background";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex flex-col justify-center items-center">
        
        <section className="relative z-10 flex flex-col items-center text-center px-4 space-y-8" id="hero">
          <div className="space-y-4">
            <TextAnimate 
              as="h1" 
              animation="slideRight" 
              className="clean-heading-xl"
            >
              MITZUSTUDIOS
            </TextAnimate>
            <TextAnimate 
              as="h2" 
              animation="slideLeft" 
              className="clean-subtitle text-lg md:text-xl max-w-3xl mx-auto"
            >
              Mi espacio personal donde desarrollo y publico mis proyectos
            </TextAnimate>
          </div>
          
          {/* Simple Decorative Line with Purple */}
          <div className="w-24 h-0.5 bg-primary rounded-full"></div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="clean-button text-base px-8 py-3"
              onClick={() => router.push("/projects")}
            >
              Ver Proyectos
            </button>
            <button 
              className="clean-button-outline text-base px-8 py-3"
              onClick={() => window.open("https://github.com/MitzuStudios", "_blank")}
            >
              GitHub
            </button>
          </div>
        </section>
      </div>

      {/* About Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8" id="aboutme">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            <div>
              <TextAnimate 
                as="h2" 
                animation="slideUp" 
                className="clean-heading-lg clean-accent-line inline-block"
              >
                SOBRE MI MARCA
              </TextAnimate>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <p className="clean-subtitle leading-relaxed">
                  MitzuStudios es mi marca personal donde centralizo todos mis proyectos 
                  de desarrollo. Este es mi espacio para experimentar, crear y mostrar 
                  mis trabajos de manera organizada y profesional.
                </p>
                
                <p className="clean-subtitle leading-relaxed">
                  Aquí desarrollo una variedad de proyectos personales, desde sitios web 
                  como Oni Workshop hasta bots de Discord y aplicaciones experimentales. 
                  Cada proyecto es una oportunidad para aprender y explorar nuevas tecnologías.
                </p>
                
                <p className="clean-subtitle leading-relaxed">
                  MitzuStudios representa mi evolución como desarrollador y mi pasión 
                  por crear experiencias digitales únicas para mis propios intereses.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="clean-card p-6 space-y-3">
                  <h3 className="clean-heading-md">Experimentación</h3>
                  <p className="text-muted-foreground">
                    Cada proyecto es una oportunidad para experimentar con nuevas 
                    tecnologías y explorar diferentes enfoques de desarrollo.
                  </p>
                </div>
                
                <div className="clean-card p-6 space-y-3">
                  <h3 className="clean-heading-md">Creatividad</h3>
                  <p className="text-muted-foreground">
                    Mis proyectos combinan funcionalidad técnica con diseño creativo, 
                    reflejando mi visión personal en cada desarrollo.
                  </p>
                </div>
                
                <div className="clean-card p-6 space-y-3">
                  <h3 className="clean-heading-md">Evolución</h3>
                  <p className="text-muted-foreground">
                    MitzuStudios documenta mi crecimiento como desarrollador y 
                    la evolución de mis habilidades técnicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="clean-card p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="clean-heading-xl">2+</h3>
                <p className="clean-subtitle">Proyectos Personales</p>
              </div>
              <div className="space-y-2">
                <h3 className="clean-heading-xl">100%</h3>
                <p className="clean-subtitle">Autoría Propia</p>
              </div>
              <div className="space-y-2">
                <h3 className="clean-heading-xl">∞</h3>
                <p className="clean-subtitle">Ideas por Explorar</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
