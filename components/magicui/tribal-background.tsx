'use client';

import { cn } from "@/lib/utils";

interface TribalBackgroundProps {
  className?: string;
  density?: number;
  opacity?: number;
}

export function TribalBackground({ 
  className,
  density = 20,
  opacity = 0.03
}: TribalBackgroundProps) {
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {/* Geometric Pattern Layer 1 */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 45%, hsl(var(--tribal-primary) / ${opacity}) 45%, hsl(var(--tribal-primary) / ${opacity}) 55%, transparent 55%),
            linear-gradient(-45deg, transparent 45%, hsl(var(--tribal-secondary) / ${opacity * 0.6}) 45%, hsl(var(--tribal-secondary) / ${opacity * 0.6}) 55%, transparent 55%)
          `,
          backgroundSize: `${density}px ${density}px, ${density * 1.5}px ${density * 1.5}px`,
          backgroundPosition: '0 0, 10px 10px'
        }}
      />
      
      {/* Geometric Pattern Layer 2 */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(var(--tribal-accent) / ${opacity * 0.4}) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, hsl(var(--tribal-primary) / ${opacity * 0.3}) 1px, transparent 1px)
          `,
          backgroundSize: `${density * 2}px ${density * 2}px, ${density * 3}px ${density * 3}px`,
        }}
      />

      {/* Floating Tribal Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 opacity-5 animate-pulse">
        <div className="w-full h-full bg-gradient-to-br from-tribal-primary to-tribal-secondary transform rotate-45 rounded-lg"></div>
      </div>
      
      <div className="absolute top-40 right-20 w-12 h-12 opacity-5 animate-pulse" style={{ animationDelay: '1s' }}>
        <div className="w-full h-full bg-gradient-to-br from-tribal-accent to-tribal-primary rounded-full"></div>
      </div>
      
      <div className="absolute bottom-40 left-20 w-20 h-20 opacity-5 animate-pulse" style={{ animationDelay: '2s' }}>
        <div className="w-full h-full bg-gradient-to-br from-tribal-secondary to-tribal-accent transform -rotate-12 rounded-lg"></div>
      </div>
      
      <div className="absolute bottom-20 right-10 w-14 h-14 opacity-5 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-full h-full bg-gradient-to-br from-tribal-primary to-tribal-accent rounded-full transform rotate-45"></div>
      </div>
    </div>
  );
}
