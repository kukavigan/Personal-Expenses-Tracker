export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string;
  created_at: string;
}

export interface ExpenseFormData {
  date: string;
  category: string;
  amount: string;
  note: string;
}
