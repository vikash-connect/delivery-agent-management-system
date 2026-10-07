import prisma from '../config/db';
import { CreateAgentInput, UpdateAgentInput, QueryAgentInput } from '../validators/agent.validator';
import { AppError } from '../middleware/error.middleware';

export class AgentService {
  async createAgent(data: CreateAgentInput) {
    // Check existing phone or email to return 409 early if needed
    const existingPhone = await prisma.deliveryAgent.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });
    if (existingPhone) {
      throw new AppError('Delivery agent with this phoneNumber already exists', 409);
    }

    const existingEmail = await prisma.deliveryAgent.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new AppError('Delivery agent with this email already exists', 409);
    }

    return await prisma.deliveryAgent.create({
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        serviceArea: data.serviceArea,
        status: data.status,
      },
    });
  }

  async getAgents(query: QueryAgentInput) {
    const { page, limit, status, serviceArea, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (serviceArea) {
      where.serviceArea = {
        contains: serviceArea,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { serviceArea: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [agents, totalItems] = await Promise.all([
      prisma.deliveryAgent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.deliveryAgent.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      agents,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getAgentById(id: string) {
    const agent = await prisma.deliveryAgent.findUnique({
      where: { id },
    });

    if (!agent) {
      throw new AppError('Delivery agent not found', 404);
    }

    return agent;
  }

  async updateAgent(id: string, data: UpdateAgentInput) {
    // Check existence first
    const existing = await prisma.deliveryAgent.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError('Delivery agent not found', 404);
    }

    // Check duplicate phone if changing
    if (data.phoneNumber && data.phoneNumber !== existing.phoneNumber) {
      const phoneConflict = await prisma.deliveryAgent.findUnique({
        where: { phoneNumber: data.phoneNumber },
      });
      if (phoneConflict) {
        throw new AppError('Delivery agent with this phoneNumber already exists', 409);
      }
    }

    // Check duplicate email if changing
    if (data.email && data.email !== existing.email) {
      const emailConflict = await prisma.deliveryAgent.findUnique({
        where: { email: data.email },
      });
      if (emailConflict) {
        throw new AppError('Delivery agent with this email already exists', 409);
      }
    }

    return await prisma.deliveryAgent.update({
      where: { id },
      data,
    });
  }

  async deleteAgent(id: string) {
    const existing = await prisma.deliveryAgent.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError('Delivery agent not found', 404);
    }

    await prisma.deliveryAgent.delete({
      where: { id },
    });
  }
}

export const agentService = new AgentService();
