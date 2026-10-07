import {
  AgentListResponse,
  SingleAgentResponse,
  CreateAgentInput,
  UpdateAgentInput,
  AgentQueryParams,
} from '../types/agent';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `HTTP ${response.status} Request Failed`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const agentApi = {
  checkHealth: async () => {
    return fetcher<{ status: string; message: string; timestamp: string }>('/health');
  },

  getAgents: async (params?: AgentQueryParams): Promise<AgentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.serviceArea) searchParams.set('serviceArea', params.serviceArea);
    if (params?.search) searchParams.set('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = `/api/agents${queryString ? `?${queryString}` : ''}`;
    return fetcher<AgentListResponse>(endpoint);
  },

  getAgentById: async (id: string): Promise<SingleAgentResponse> => {
    return fetcher<SingleAgentResponse>(`/api/agents/${id}`);
  },

  createAgent: async (data: CreateAgentInput): Promise<SingleAgentResponse> => {
    return fetcher<SingleAgentResponse>('/api/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAgent: async (id: string, data: UpdateAgentInput): Promise<SingleAgentResponse> => {
    return fetcher<SingleAgentResponse>(`/api/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAgent: async (id: string): Promise<void> => {
    return fetcher<void>(`/api/agents/${id}`, {
      method: 'DELETE',
    });
  },
};
