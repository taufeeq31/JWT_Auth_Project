import express from 'express';
const router = express.Router();

import {
	createTransaction,
	listTransactions,
	updateTransaction,
	deleteTransaction,
} from '../controllers/transaction.controllers.js';

router.post('/', createTransaction);
router.get('/', listTransactions);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
