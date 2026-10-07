import React from 'react';
import { DeliveryAgent } from '../../types/agent';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AgentTableProps {
  agents: DeliveryAgent[];
  isLoading: boolean;
  onView: (agent: DeliveryAgent) => void;
  onEdit: (agent: DeliveryAgent) => void;
  onDelete: (agent: DeliveryAgent) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  onAddAgent: () => void;
}

export const AgentTable: React.FC<AgentTableProps> = ({
  agents,
  isLoading,
  onView,
  onEdit,
  onDelete,
  isFiltered,
  onResetFilters,
  onAddAgent,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-800/60 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        {isFiltered ? (
          <div>
            <h3 className="text-base font-semibold text-slate-200">No matching agents found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No delivery agents match your active search term or filter criteria.
            </p>
            <Button onClick={onResetFilters} variant="secondary" size="sm" className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-semibold text-slate-200">No delivery agents exist</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Get started by registering your first delivery agent in the management system.
            </p>
            <Button onClick={onAddAgent} variant="primary" size="sm" className="mt-4">
              Add First Agent
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 sm:px-6">Full Name</th>
              <th className="py-3.5 px-4 sm:px-6">Contact Info</th>
              <th className="py-3.5 px-4 sm:px-6">Service Area</th>
              <th className="py-3.5 px-4 sm:px-6">Status</th>
              <th className="py-3.5 px-4 sm:px-6">Created</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {agents.map((agent) => (
              <tr
                key={agent.id}
                className="hover:bg-slate-800/40 transition-colors duration-150 text-slate-200 group"
              >
                <td className="py-4 px-4 sm:px-6 font-semibold text-white">
                  {agent.fullName}
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex flex-col">
                    <span className="text-slate-200">{agent.email}</span>
                    <span className="text-xs text-slate-400">{agent.phoneNumber}</span>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 text-slate-300">
                  <span className="inline-block bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-md text-xs font-medium">
                    {agent.serviceArea}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <Badge status={agent.status} />
                </td>
                <td className="py-4 px-4 sm:px-6 text-xs text-slate-400">
                  {formatDate(agent.createdAt)}
                </td>
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      onClick={() => onView(agent)}
                      variant="ghost"
                      size="sm"
                      title="View Details"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => onEdit(agent)}
                      variant="ghost"
                      size="sm"
                      title="Edit Agent"
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(agent)}
                      variant="ghost"
                      size="sm"
                      title="Delete Agent"
                      className="text-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
