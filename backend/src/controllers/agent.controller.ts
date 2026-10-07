import { Request, Response, NextFunction } from 'express';
import { agentService } from '../services/agent.service';
import { createAgentSchema, updateAgentSchema, queryAgentSchema } from '../validators/agent.validator';

export class AgentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createAgentSchema.parse(req.body);
      const agent = await agentService.createAgent(validatedData);

      res.status(201).json({
        success: true,
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryAgentSchema.parse(req.query);
      const result = await agentService.getAgents(query);

      res.status(200).json({
        success: true,
        data: result.agents,
        pagination: result.pagination,
        cached: result.cached,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const agent = await agentService.getAgentById(id);

      res.status(200).json({
        success: true,
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateAgentSchema.parse(req.body);
      const updatedAgent = await agentService.updateAgent(id, validatedData);

      res.status(200).json({
        success: true,
        data: updatedAgent,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await agentService.deleteAgent(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const agentController = new AgentController();
