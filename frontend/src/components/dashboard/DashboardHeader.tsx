import React from 'react';
import { Button } from '../ui/Button';

interface DashboardHeaderProps {
  onAddAgentClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddAgentClick }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Delivery Agent Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage, monitor, and configure active delivery personnel across service areas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onAddAgentClick} variant="primary" size="md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Agent
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
