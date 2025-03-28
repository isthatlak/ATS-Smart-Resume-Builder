
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  activeTab: 'upload' | 'create' | 'analyze' | 'preview';
  setActiveTab: (tab: 'upload' | 'create' | 'analyze' | 'preview') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="w-full backdrop-blur-lg bg-background/80 border-b border-border/40 fixed top-0 z-50 transition-all duration-200 ease-in-out">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
            Resume Architect
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { id: 'upload', label: 'Upload' },
            { id: 'create', label: 'Create' },
            { id: 'analyze', label: 'Analyze' },
            { id: 'preview', label: 'Preview' }
          ].map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                'relative px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out',
                activeTab === item.id 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-primary" />
              )}
            </Button>
          ))}
        </nav>
        
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
