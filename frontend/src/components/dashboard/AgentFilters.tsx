import React from 'react';
import { AgentStatus } from '../../types/agent';
import { Button } from '../ui/Button';

interface AgentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AgentStatus | '';
  onStatusChange: (status: AgentStatus | '') => void;
  serviceArea: string;
  onServiceAreaChange: (value: string) => void;
  onReset: () => void;
  isFiltered: boolean;
}

export const AgentFilters: React.FC<AgentFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  serviceArea,
  onServiceAreaChange,
  onReset,
  isFiltered,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search agents by name, phone, email, or area..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="w-full md:w-44">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as AgentStatus | '')}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">Status: All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* Service Area Input Filter */}
        <div className="w-full md:w-56">
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => onServiceAreaChange(e.target.value)}
            placeholder="Filter Service Area..."
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Reset Filters Button */}
        {isFiltered && (
          <Button onClick={onReset} variant="outline" size="md" className="shrink-0">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
