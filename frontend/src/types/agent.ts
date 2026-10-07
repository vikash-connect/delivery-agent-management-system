export type AgentStatus = 'ACTIVE' | 'INACTIVE';

export interface DeliveryAgent {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  serviceArea: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AgentListResponse {
  success: boolean;
  data: DeliveryAgent[];
  pagination: PaginationMeta;
  cached?: boolean;
}

export interface SingleAgentResponse {
  success: boolean;
  data: DeliveryAgent;
}

export interface CreateAgentInput {
  fullName: string;
  phoneNumber: string;
  email: string;
  serviceArea: string;
  status?: AgentStatus;
}

export interface UpdateAgentInput {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  serviceArea?: string;
  status?: AgentStatus;
}

export interface AgentQueryParams {
  page?: number;
  limit?: number;
  status?: AgentStatus | '';
  serviceArea?: string;
  search?: string;
}
