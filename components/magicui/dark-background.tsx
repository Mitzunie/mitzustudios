'use client';

import { cn } from "@/lib/utils";

interface DarkBackgroundProps {
  className?: string;
  density?: number;
  opacity?: number;
}

export function DarkBackground({ 
  className,
  density = 30,
  opacity = 0.02
}: DarkBackgroundProps) {
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {/* Dark Geometric Pattern Layer */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 45%, hsl(var(--dark-primary) / ${opacity}) 45%, hsl(var(--dark-primary) / ${opacity}) 55%, transparent 55%),
            linear-gradient(-45deg, transparent 45%, hsl(var(--dark-secondary) / ${opacity * 0.6}) 45%, hsl(var(--dark-secondary) / ${opacity * 0.6}) 55%, transparent 55%)
          `,
          backgroundSize: `${density}px ${density}px, ${density * 1.5}px ${density * 1.5}px`,
          backgroundPosition: '0 0, 15px 15px'
        }}
      />
      
      {/* Neon dots pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(var(--neon-purple) / ${opacity * 0.4}) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, hsl(var(--dark-accent) / ${opacity * 0.3}) 1px, transparent 1px)
          `,
          backgroundSize: `${density * 2}px ${density * 2}px, ${density * 3}px ${density * 3}px`,
        }}
      />

      {/* Floating Dark Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 opacity-5 animate-pulse">
        <div className="w-full h-full bg-gradient-to-br from-dark-primary to-dark-secondary transform rotate-45 rounded-2xl"></div>
      </div>
      
      <div className="absolute top-40 right-20 w-16 h-16 opacity-5 animate-pulse" style={{ animationDelay: '1s' }}>
        <div className="w-full h-full bg-gradient-to-br from-neon-purple to-dark-accent rounded-full"></div>
      </div>
      
      <div className="absolute bottom-40 left-20 w-24 h-24 opacity-5 animate-pulse" style={{ animationDelay: '2s' }}>
        <div className="w-full h-full bg-gradient-to-br from-dark-secondary to-dark-accent transform -rotate-12 rounded-3xl"></div>
      </div>
      
      <div className="absolute bottom-20 right-10 w-18 h-18 opacity-5 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-full h-full bg-gradient-to-br from-dark-primary to-neon-purple rounded-full transform rotate-45"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-dark-primary/5 to-transparent"></div>
    </div>
  );
}
