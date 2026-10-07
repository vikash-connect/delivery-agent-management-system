import React, { useState, useEffect } from 'react';
import { DeliveryAgent } from '../../types/agent';
import { agentApi } from '../../lib/api';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string | null;
}

export const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({
  isOpen,
  onClose,
  agentId,
}) => {
  const [agent, setAgent] = useState<DeliveryAgent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (isOpen && agentId) {
      const loadAgentDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await agentApi.getAgentById(agentId);
          if (!isCancelled) {
            setAgent(res.data);
          }
        } catch (err: unknown) {
          if (!isCancelled) {
            setError((err as Error).message || 'Failed to load agent details');
          }
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      };

      loadAgentDetails();
    }

    return () => {
      isCancelled = true;
    };
  }, [isOpen, agentId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delivery Agent Details"
      description="System profile details fetched directly from database"
      maxWidth="md"
    >
      {isLoading ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Fetching latest agent details...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-center text-xs text-rose-400">
          {error}
        </div>
      ) : agent ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-lg font-bold text-white">{agent.fullName}</h4>
              <span className="text-xs font-mono text-indigo-400">ID: {agent.id}</span>
            </div>
            <Badge status={agent.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Phone Number
              </span>
              <span className="text-slate-200 font-mono text-sm">{agent.phoneNumber}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Email Address
              </span>
              <span className="text-slate-200 text-sm truncate block">{agent.email}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Service Area
              </span>
              <span className="text-slate-200 font-medium text-sm">{agent.serviceArea}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Current Status
              </span>
              <span className="text-slate-200 font-medium text-sm">{agent.status}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Created At
              </span>
              <span className="text-slate-400 text-xs">{formatDate(agent.createdAt)}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                Last Updated
              </span>
              <span className="text-slate-400 text-xs">{formatDate(agent.updatedAt)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button onClick={onClose} variant="secondary" size="md">
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
