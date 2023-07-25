import express, { Router } from 'express';
import { execute, status } from '../controllers/executionController';
import authenticationMiddleware from '../middlewares/authenticationMiddleware';

const router: Router = express.Router();

router.post('/', authenticationMiddleware, execute);
router.get('/status/:id', status);

export default router;