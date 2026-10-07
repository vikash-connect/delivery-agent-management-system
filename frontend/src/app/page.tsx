'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DeliveryAgent,
  AgentStatus,
  PaginationMeta,
  CreateAgentInput,
  UpdateAgentInput,
} from '../types/agent';
import { agentApi } from '../lib/api';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { AgentFilters } from '../components/dashboard/AgentFilters';
import { AgentTable } from '../components/dashboard/AgentTable';
import { Pagination } from '../components/dashboard/Pagination';
import { AgentFormModal } from '../components/agents/AgentFormModal';
import { AgentDetailsModal } from '../components/agents/AgentDetailsModal';
import { DeleteAgentDialog } from '../components/agents/DeleteAgentDialog';

export default function DashboardPage() {
  // Agent List & Pagination State
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Summary Cards State
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | ''>('');
  const [serviceAreaFilter, setServiceAreaFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<DeliveryAgent | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formServerError, setFormServerError] = useState<string | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<DeliveryAgent | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteServerError, setDeleteServerError] = useState<string | null>(null);

  // Handle Search Debouncing (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Toast auto-clear helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Summary Stats from backend API
  const fetchSummaryStats = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const [allRes, activeRes, inactiveRes] = await Promise.all([
        agentApi.getAgents({ limit: 1 }),
        agentApi.getAgents({ limit: 1, status: 'ACTIVE' }),
        agentApi.getAgents({ limit: 1, status: 'INACTIVE' }),
      ]);
      setTotalCount(allRes.pagination.totalItems);
      setActiveCount(activeRes.pagination.totalItems);
      setInactiveCount(inactiveRes.pagination.totalItems);
    } catch {
      // Fallback if summary stats fetch fails
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  // Fetch Agents List from backend API
  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await agentApi.getAgents({
        page: currentPage,
        limit: 10,
        status: statusFilter,
        serviceArea: serviceAreaFilter,
        search: debouncedSearch,
      });

      setAgents(response.data);
      setPagination(response.pagination);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch delivery agents from server');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, serviceAreaFilter, debouncedSearch]);

  // Initial Load Effects
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchSummaryStats();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchSummaryStats]);

  useEffect(() => {
    let isMounted = true;

    const loadAgents = async () => {
      if (isMounted) {
        await fetchAgents();
      }
    };

    loadAgents();

    return () => {
      isMounted = false;
    };
  }, [fetchAgents]);

  // Filter Reset Handlers
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('');
    setServiceAreaFilter('');
    setCurrentPage(1);
  };

  const isFiltered = Boolean(search || statusFilter || serviceAreaFilter);

  // Form Submit Handler (Add or Edit)
  const handleFormSubmit = async (data: CreateAgentInput | UpdateAgentInput) => {
    setFormLoading(true);
    setFormServerError(null);
    try {
      if (agentToEdit) {
        await agentApi.updateAgent(agentToEdit.id, data as UpdateAgentInput);
        showToast(`Agent "${data.fullName || agentToEdit.fullName}" updated successfully`);
      } else {
        await agentApi.createAgent(data as CreateAgentInput);
        showToast(`Agent "${data.fullName}" registered successfully`);
      }
      setIsFormOpen(false);
      setAgentToEdit(null);
      fetchAgents();
      fetchSummaryStats();
    } catch (err: unknown) {
      setFormServerError((err as Error).message || 'An error occurred while saving the agent');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return;
    setDeleteLoading(true);
    setDeleteServerError(null);
    try {
      await agentApi.deleteAgent(agentToDelete.id);
      showToast(`Agent "${agentToDelete.fullName}" deleted successfully`);
      setIsDeleteOpen(false);
      setAgentToDelete(null);

      // Adjust page if deleting last item on current page
      if (agents.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchAgents();
      }
      fetchSummaryStats();
    } catch (err: unknown) {
      setDeleteServerError((err as Error).message || 'Failed to delete agent');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${toastMessage.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <DashboardHeader
        onAddAgentClick={() => {
          setAgentToEdit(null);
          setFormServerError(null);
          setIsFormOpen(true);
        }}
      />

      {/* Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Summary Cards Overview */}
        <SummaryCards
          totalAgents={totalCount}
          activeAgents={activeCount}
          inactiveAgents={inactiveCount}
          isLoading={isSummaryLoading}
        />

        {/* Global Error Banner with Retry Button */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-rose-300 font-medium">{error}</p>
            </div>
            <button
              onClick={fetchAgents}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Search & Filtering Control Bar */}
        <AgentFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          status={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          serviceArea={serviceAreaFilter}
          onServiceAreaChange={(val) => {
            setServiceAreaFilter(val);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* Agent Data Table */}
        <AgentTable
          agents={agents}
          isLoading={isLoading}
          onView={(agent) => {
            setSelectedAgentId(agent.id);
            setIsDetailsOpen(true);
          }}
          onEdit={(agent) => {
            setAgentToEdit(agent);
            setFormServerError(null);
            setIsFormOpen(true);
          }}
          onDelete={(agent) => {
            setAgentToDelete(agent);
            setDeleteServerError(null);
            setIsDeleteOpen(true);
          }}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onAddAgent={() => {
            setAgentToEdit(null);
            setFormServerError(null);
            setIsFormOpen(true);
          }}
        />

        {/* Pagination Bar */}
        {!isLoading && agents.length > 0 && (
          <Pagination
            meta={pagination}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </main>

      {/* Add / Edit Agent Form Modal */}
      <AgentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setAgentToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        agentToEdit={agentToEdit}
        isLoading={formLoading}
        serverError={formServerError}
      />

      {/* View Agent Details Modal */}
      <AgentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAgentId(null);
        }}
        agentId={selectedAgentId}
      />

      {/* Delete Agent Confirmation Dialog */}
      <DeleteAgentDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setAgentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        agent={agentToDelete}
        isLoading={deleteLoading}
        error={deleteServerError}
      />
    </div>
  );
}
