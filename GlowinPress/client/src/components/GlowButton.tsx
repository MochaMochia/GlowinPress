import * as React from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowButton({ 
  children, 
  className, 
  glowColor = "rgba(139, 92, 246, 0.4)",
  ...props 
}: GlowButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Glow effect - only on desktop */}
      {isHovered && (
        <div
          className="absolute pointer-events-none opacity-0 md:opacity-100 transition-opacity duration-300"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(10px)',
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </button>
  );
}
