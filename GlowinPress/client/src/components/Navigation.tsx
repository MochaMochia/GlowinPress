import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface NavigationProps {
  onToolClick?: (tool: string) => void;
}

export function Navigation({ onToolClick }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="glass-nav border-b border-white/20 dark:border-gray-800/50 sticky top-0 z-40 backdrop-blur-xl bg-[#fffffbd]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <Link
              to="/"
              className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
            >
              Media Tools
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
