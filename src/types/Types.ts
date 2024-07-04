export interface LoginResponse {
    jwt: string;
    user: string;
    id: number;
}

export interface BalanceResponse {
    userId: number;
    netBalance: number;
    totalIncome: number;
    totalExpense: number;
}

export interface ExpenseResponse {
    userId: number;
    amount: number;
    description: string;
    date: string;
    category: string;
}

export interface IncomeResponse {
    userId: number;
    amount: number;
    description: string;
    date: string;
    category: string;
}