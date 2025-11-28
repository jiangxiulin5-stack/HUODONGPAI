import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, fullScreen }) => {
  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${fullScreen ? 'h-screen overflow-hidden' : ''}`}>
      {children}
    </div>
  );
};