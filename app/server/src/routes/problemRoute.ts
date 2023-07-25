import express, { Router } from 'express';
import { submit, listAll, list, get } from '../controllers/problemController';
import authenticationMiddleware from '../middlewares/authenticationMiddleware';

const router: Router = express.Router();

router.post('/submit', authenticationMiddleware, submit);
router.get('/list', authenticationMiddleware, list);
router.get('/list/all', listAll);
router.get('/get', get);

export default router;