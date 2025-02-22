export type Transaction = {
	date: Date;
	currency: string;
	/** Positive means a credit, negative a debit */
	amount: number;
	/** Balance after the transaction has taken place */
	balance: number;
	payee: string;
	memo?: string;
};
