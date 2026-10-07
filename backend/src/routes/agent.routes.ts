import { Router } from 'express';
import { agentController } from '../controllers/agent.controller';

const router = Router();

router.post('/', agentController.create);
router.get('/', agentController.getAll);
router.get('/:id', agentController.getById);
router.put('/:id', agentController.update);
router.delete('/:id', agentController.delete);

export default router;
