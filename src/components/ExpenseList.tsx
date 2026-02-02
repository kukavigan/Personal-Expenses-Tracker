import { Calendar, Euro } from 'lucide-react';
import type { Expense } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  monthlyTotal: number;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, monthlyTotal, onDelete }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">This Month's Expenses</h2>
        <div className="flex items-center gap-2 text-blue-600">
          <Calendar size={20} />
          <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No expenses recorded this month</p>
          <p className="text-sm mt-2">Add your first expense to get started</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Note</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-gray-700">{formatDate(expense.date)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {formatAmount(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{expense.note || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Euro size={24} />
              <span className="text-lg font-semibold">Monthly Total</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatAmount(monthlyTotal)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
