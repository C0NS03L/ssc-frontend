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

// Corresponds to the Expense class
interface Expense {
  id?: number;
  amount: number;
  description: string;
  date: string;
  user: User;
  category: Category;
}

// Corresponds to the AppUser class
interface User {
  id: number;
}

// Corresponds to the Category class
interface Category {
  id: number;
}

// Corresponds to the request body for the addExpense method in ExpenseController
interface AddExpenseRequest {
  amount: number;
  description: string;
  date: string;
  user: User;
  category: Category;
}

// Corresponds to the response from the addExpense method in ExpenseController
type AddExpenseResponse = Expense;

// Corresponds to the Balance class
interface Balance {
  id?: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  user: User;
}

// Corresponds to the response from the getBalance method in BalanceController
type GetBalanceResponse = Balance;

// Corresponds to the request body for the updateBalance method in BalanceService
interface UpdateBalanceRequest {
  userId: number;
  income: number;
  expense: number;
}

// Corresponds to the response from the updateBalance method in BalanceService
type UpdateBalanceResponse = Balance;