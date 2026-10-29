import express from 'express';
const router = express.Router();

import {
	createTransaction,
	listTransactions,
	updateTransaction,
	deleteTransaction,
} from '@/controllers/transaction.controllers.js';

import { protect } from '@/middlewares/auth.middleware.js';

// Create a transaction
router.post('/', protect, createTransaction);

// List all transactions for the logged-in user
router.get('/', protect, listTransactions);

// Update a transaction
router.patch('/:id', protect, updateTransaction);

// Delete a transaction
router.delete('/:id', protect, deleteTransaction);

export default router;
