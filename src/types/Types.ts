/* eslint-disable @typescript-eslint/no-unused-vars */

export interface LoginResponse {
  jwt: string;
  user: string;
  id: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: Date;
  category:
    | "Food"
    | "Transport"
    | "Entertainment"
    | "Health"
    | "Shopping"
    | "Bills"
    | "Others";
}

export interface Income {
  id: number;
  description: string;
  amount: number;
  date: Date;
  category: "Salary" | "Gift" | "Investment" | "Others";
}
