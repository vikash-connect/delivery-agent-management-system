import React, { useState } from 'react';
import { DeliveryAgent, AgentStatus, CreateAgentInput, UpdateAgentInput } from '../../types/agent';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAgentInput | UpdateAgentInput) => Promise<void>;
  agentToEdit?: DeliveryAgent | null;
  isLoading: boolean;
  serverError?: string | null;
}

export const AgentFormModal: React.FC<AgentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  agentToEdit,
  isLoading,
  serverError,
}) => {
  const isEditing = Boolean(agentToEdit);

  const [fullName, setFullName] = useState(agentToEdit?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(agentToEdit?.phoneNumber || '');
  const [email, setEmail] = useState(agentToEdit?.email || '');
  const [serviceArea, setServiceArea] = useState(agentToEdit?.serviceArea || '');
  const [status, setStatus] = useState<AgentStatus>(agentToEdit?.status || 'ACTIVE');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

    if (!phoneNumber.trim() || phoneNumber.trim().length < 7) {
      newErrors.phoneNumber = 'Phone Number must be at least 7 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Valid Email Address format is required';
    }

    if (!serviceArea.trim()) {
      newErrors.serviceArea = 'Service Area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      serviceArea: serviceArea.trim(),
      status,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Delivery Agent' : 'Add New Delivery Agent'}
      description={
        isEditing
          ? 'Update the profile parameters and status of this delivery agent'
          : 'Register a new delivery agent into the management system'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 font-medium">
            {serverError}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Marcus Vance"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.fullName && (
            <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Phone Number <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. +15551234567"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-rose-400 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. marcus.vance@example.com"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Service Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Service Area <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            placeholder="e.g. Downtown Central"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.serviceArea && (
            <p className="text-xs text-rose-400 mt-1">{errors.serviceArea}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Status <span className="text-rose-400">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AgentStatus)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" onClick={onClose} variant="secondary" size="md">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
