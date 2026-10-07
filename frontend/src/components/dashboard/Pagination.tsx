import React from 'react';
import { PaginationMeta } from '../../types/agent';
import { Button } from '../ui/Button';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { page, totalPages, totalItems, hasPrevPage, hasNextPage, limit } = meta;

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <div className="text-xs sm:text-sm text-slate-400">
        Showing <span className="font-semibold text-slate-200">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-200">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-200">{totalItems}</span> agents
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          variant="secondary"
          size="sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>

        <div className="px-3 py-1 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg">
          Page {page} of {totalPages}
        </div>

        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          variant="secondary"
          size="sm"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
