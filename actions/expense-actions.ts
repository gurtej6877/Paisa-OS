'use server'

import { createClient } from '@/lib/supabase/server';
import { appendExpenseToSheet } from '@/lib/google-sheets';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const newExpense = {
    user_id: user.id,
    amount: parseFloat(formData.get('amount') as string),
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    payment_method: formData.get('payment_method') as string,
    expense_date: formData.get('date') as string,
    notes: formData.get('notes') as string || null,
  };

  // 1. Save to Supabase (Primary Source of Truth)
  const { data, error } = await supabase
    .from('expenses')
    .insert(newExpense)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Sync to Google Sheets (Non-blocking background sync conceptually)
  // Even if this fails, the DB record is secure.
  await appendExpenseToSheet(data);

  // 3. Revalidate UI cache
  revalidatePath('/dashboard');
  revalidatePath('/expenses');
  
  return { success: true, data };
}
