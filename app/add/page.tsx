'use client'
import { useState, useEffect } from 'react'
import { createExpense } from '@/actions/expense-actions'
import { formatINR } from '@/lib/utils'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Subscriptions', 'Education', 'Fitness', 'Travel', 'Bills', 'Personal', 'Other']
const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other']

export default function AddExpense() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)
  
  // Local storage cache for payment method to speed up repeated entries
  const [prefPayment, setPrefPayment] = useState('UPI')
  useEffect(() => {
    setPrefPayment(localStorage.getItem('fintrack_pref_payment') || 'UPI')
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    const formData = new FormData(e.currentTarget)
    
    // Save preference
    localStorage.setItem('fintrack_pref_payment', formData.get('payment_method') as string)

    try {
      await createExpense(formData)
      setStatus({ type: 'success', msg: 'Expense saved successfully & synced.' })
      e.currentTarget.reset()
      // Reset defaults
      ;(e.currentTarget.elements.namedItem('date') as HTMLInputElement).value = new Date().toISOString().split('T')[0]
      ;(e.currentTarget.elements.namedItem('payment_method') as HTMLSelectElement).value = prefPayment
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to save expense.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto w-full pt-4 md:pt-10">
      <h1 className="text-3xl font-semibold mb-6">New Expense</h1>
      
      {status && (
        <div className={`p-4 mb-6 rounded-xl border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Amount (₹)</label>
          <input 
            type="number" 
            name="amount" 
            step="0.01" 
            required 
            autoFocus
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
          <input 
            type="text" 
            name="description" 
            required 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[16px] focus:ring-2 focus:ring-indigo-500 outline-none" 
            placeholder="What was this for?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[16px] focus:ring-2 focus:ring-indigo-500 outline-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Payment</label>
            <select name="payment_method" defaultValue={prefPayment} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[16px] focus:ring-2 focus:ring-indigo-500 outline-none">
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
          <input 
            type="date" 
            name="date" 
            defaultValue={new Date().toISOString().split('T')[0]} 
            required 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[16px] focus:ring-2 focus:ring-indigo-500 outline-none dark:[color-scheme:dark]"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl text-lg shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Expense'}
        </button>
      </form>
    </div>
  )
}
