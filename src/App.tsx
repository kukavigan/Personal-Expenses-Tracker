import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { supabase } from './lib/supabase';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Notification } from './components/Notification';
import type { Expense, ExpenseFormData } from './types/expense';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState('');     

  const fetchExpenses = async () => {
    let firstDayStr, lastDayStr;

    if (startDate && endDate) {
      
      firstDayStr = startDate;
      lastDayStr = endDate;
    } else {
      
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      firstDayStr = firstDay.toISOString().split('T')[0];
      lastDayStr = lastDay.toISOString().split('T')[0];
    }
    
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', firstDayStr)
      .lte('date', lastDayStr)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching expenses:', error);
      setNotification({
        message: 'Failed to load expenses',
        type: 'error',
      });
      return;
    }

    setExpenses(data || []);
    const total = (data || []).reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
    setMonthlyTotal(total);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (formData: ExpenseFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('expenses').insert([
        {
          date: formData.date,
          category: formData.category,
          amount: parseFloat(formData.amount),
          note: formData.note,
        },
      ]);

      if (error) throw error;

      setNotification({
        message: 'Expense added successfully',
        type: 'success',
      });

      await fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      setNotification({
        message: 'Failed to add expense',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
  
  if (!confirm('Are you sure you want to delete this expense?')) return;

  const { error } = await supabase.from('expenses').delete().eq('id', id);

  if (error) {
    console.error('Error deleting expense:', error);
    setNotification({ message: 'Failed to delete expense', type: 'error' });
    return;
  }
  
  setNotification({ message: 'Expense deleted successfully', type: 'success' });
  
  await fetchExpenses();
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Expense Tracker</h1>
          </div>
          <p className="text-gray-600 ml-[52px]">Keep track of your daily expenses with ease</p>
        </header>

        <div className="space-y-8">
          <ExpenseForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          <div className="flex items-center gap-3 mb-4">
            <input
            type = "date"
            value = {startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-1"
            />
            <span>to</span>
            <input
            type = "date"
            value ={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-1"
            />
            <button
              onClick={fetchExpenses}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Filter 
            </button>
            <button
              onClick={() => { setStartDate(''); setEndDate(''); fetchExpenses(); }}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
          <ExpenseList
            expenses={expenses}
            monthlyTotal={monthlyTotal}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
