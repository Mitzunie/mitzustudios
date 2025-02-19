'use client';

import { useRouter } from 'next/navigation';
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { RainbowButton } from '@/components/magicui/rainbow-button';

export default function EasterEgg() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/');
  };

  return (
      <main className="w-full h-screen flex items-center justify-center">
        <div className="mt-20">
          <NeonGradientCard className="max-w-sm text-center">
            <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              Kamerr Ezz Gay
            </span>
            <RainbowButton className="mt-4" onClick={handleRedirect}>
              Regresar a la página principal
            </RainbowButton>
          </NeonGradientCard>
        </div>
      </main>
  );
}