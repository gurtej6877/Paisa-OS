'use client'
import { useState, useEffect } from 'react'
import { parseNaturalLanguageExpense } from '@/lib/utils'
import { createExpense } from '@/actions/expense-actions'
import { Plus, X } from 'lucide-react'

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (input.trim()) {
      const res = parseNaturalLanguageExpense(input)
      setParsed(res)
    } else {
      setParsed(null)
    }
  }, [input])

  async function handleQuickSave() {
    if (!parsed) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('amount', parsed.amount.toString())
      formData.append('description', parsed.description)
      formData.append('category', parsed.category)
      formData.append('payment_method', 'UPI')
      formData.append('date', parsed.date)
      formData.append('notes', 'Quick add via Command Bar')

      await createExpense(formData)
      setInput('')
      setIsOpen(false)
    } catch (err) {
      console.error('Quick-save failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Mobile Sticky Floating Quick Add Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl z-40 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-[10vh] px-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Command Entry</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 450 dinner yesterday"
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[16px] outline-none text-white focus:ring-2 focus:ring-indigo-500"
              />
              
              {parsed && (
                <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-sm">
                  <p className="text-slate-400 font-medium">Parsed Result Preview:</p>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div><span className="text-slate-500">Amount:</span> ₹{parsed.amount}</div>
                    <div><span className="text-slate-500">Desc:</span> {parsed.description}</div>
                    <div><span className="text-slate-500">Category:</span> {parsed.category}</div>
                    <div><span className="text-slate-500">Date:</span> {parsed.date}</div>
                  </div>
                  <button
                    onClick={handleQuickSave}
                    disabled={loading}
                    className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Confirm & Save (UPI)'}
                  </button>
                </div>
              )}
            </div>
            <div className="bg-slate-950 px-4 py-2 text-[11px] text-slate-500 border-t border-slate-800 flex justify-between">
              <span>Format: [amount] [description]</span>
              <span>ESC to exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
