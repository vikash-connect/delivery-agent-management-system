import React from 'react';
import { DeliveryAgent } from '../../types/agent';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeleteAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  agent: DeliveryAgent | null;
  isLoading: boolean;
  error?: string | null;
}

export const DeleteAgentDialog: React.FC<DeleteAgentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  agent,
  isLoading,
  error,
}) => {
  if (!agent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Delivery Agent"
      description="This action will permanently delete the agent record from the system."
      maxWidth="sm"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400">
            {error}
          </div>
        )}

        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-200">
              Are you sure you want to delete <strong className="text-white font-semibold">{agent.fullName}</strong>?
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Area: <span className="text-slate-300">{agent.serviceArea}</span> • Phone: <span className="text-slate-300">{agent.phoneNumber}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button onClick={onClose} variant="secondary" size="md">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="danger" size="md" isLoading={isLoading}>
            Delete Agent
          </Button>
        </div>
      </div>
    </Modal>
  );
};
