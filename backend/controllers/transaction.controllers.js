import mongoose from 'mongoose';
import Transaction from '../models/transaction.model.js';

// CREATE: Add a new transaction
const createTransaction = async (req, res) => {
	try {
		const { type, amount, category, date, paymentMode, description } = req.body;

		if (!['income', 'expense'].includes(type)) {
			return res.status(400).json({
				message: 'Type must be income or expense.',
			});
		}

		if (amount === undefined || !Number.isFinite(Number(amount)) || Number(amount) < 0) {
			return res.status(400).json({
				message: 'Amount must be a non-negative number.',
			});
		}

		if (!category?.trim() || !paymentMode?.trim()) {
			return res.status(400).json({
				message: 'Category and payment mode are required.',
			});
		}

		const transaction = await Transaction.create({
			userId: req.userId,
			type,
			amount: Number(amount),
			category,
			date: date || Date.now(),
			paymentMode,
			description: description || '',
		});

		return res.status(201).json({
			message: 'Transaction created successfully.',
			transaction,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to create transaction.',
			error: error.message,
		});
	}
};

// READ: Get all transactions belonging to the logged-in user
const listTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.find({
			userId: req.userId,
		}).sort({ date: -1, createdAt: -1 });

		return res.status(200).json({
			count: transactions.length,
			transactions,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to fetch transactions.',
			error: error.message,
		});
	}
};

// UPDATE: Update a transaction by its ID
const updateTransaction = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({
				message: 'Invalid transaction ID.',
			});
		}

		const allowedFields = ['type', 'amount', 'category', 'date', 'paymentMode', 'description'];

		const updates = {};

		for (const field of allowedFields) {
			if (Object.prototype.hasOwnProperty.call(req.body, field)) {
				updates[field] = req.body[field];
			}
		}

		if (updates.type !== undefined && !['income', 'expense'].includes(updates.type)) {
			return res.status(400).json({
				message: 'Type must be income or expense.',
			});
		}

		if (updates.amount !== undefined) {
			if (!Number.isFinite(Number(updates.amount)) || Number(updates.amount) < 0) {
				return res.status(400).json({
					message: 'Amount must be a non-negative number.',
				});
			}

			updates.amount = Number(updates.amount);
		}

		if (
			updates.category !== undefined &&
			(typeof updates.category !== 'string' || !updates.category.trim())
		) {
			return res.status(400).json({
				message: 'Category cannot be empty.',
			});
		}

		if (
			updates.paymentMode !== undefined &&
			(typeof updates.paymentMode !== 'string' || !updates.paymentMode.trim())
		) {
			return res.status(400).json({
				message: 'Payment mode cannot be empty.',
			});
		}

		const transaction = await Transaction.findOneAndUpdate(
			{
				_id: id,
				userId: req.userId,
			},
			{ $set: updates },
			{
				new: true,
				runValidators: true,
			}
		);

		if (!transaction) {
			return res.status(404).json({
				message: 'Transaction not found.',
			});
		}

		return res.status(200).json({
			message: 'Transaction updated successfully.',
			transaction,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to update transaction.',
			error: error.message,
		});
	}
};

// DELETE: Delete a transaction by its ID
const deleteTransaction = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({
				message: 'Invalid transaction ID.',
			});
		}

		const transaction = await Transaction.findOneAndDelete({
			_id: id,
			userId: req.userId,
		});

		if (!transaction) {
			return res.status(404).json({
				message: 'Transaction not found.',
			});
		}

		return res.status(200).json({
			message: 'Transaction deleted successfully.',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to delete transaction.',
			error: error.message,
		});
	}
};

export { createTransaction, listTransactions, updateTransaction, deleteTransaction };

