import React, { ReactNode } from 'react';

interface ExperimentLayoutProps {
  title: string;
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
}

export function ExperimentLayout({ title, leftSidebar, rightSidebar, children }: ExperimentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">{title}</h1>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Apparatus */}
          <div className="col-span-3">{leftSidebar}</div>
          
          {/* Main Content - Lab Bench */}
          <div className="col-span-6">{children}</div>
          
          {/* Right Sidebar - Results */}
          <div className="col-span-3">{rightSidebar}</div>
        </div>
      </div>
    </div>
  );
}