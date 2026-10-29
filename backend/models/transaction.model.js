import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		type: {
			type: String,
			enum: ['income', 'expense'],
			required: true,
		},

		amount: {
			type: Number,
			required: true,
			min: 0,
		},

		category: {
			type: String,
			required: true,
			trim: true,
		},

		date: {
			type: Date,
			default: Date.now,
			required: true,
		},

		paymentMode: {
			type: String,
			required: true,
			trim: true,
		},

		description: {
			type: String,
			trim: true,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
