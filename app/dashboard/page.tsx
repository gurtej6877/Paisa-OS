import { createClient } from '@/lib/supabase/server'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'
import { Activity, Wallet, Target } from 'lucide-react'

export default async function Dashboard() {
  const supabase = createClient()
  // Securely grab the session
  const { data: { user } } = await supabase.auth.getUser()
  
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
  
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .gte('expense_date', firstDay)
    .order('expense_date', { ascending: false })

  // Added explicit types (sum: number, exp: any) to satisfy the strict compiler
  const currentMonthTotal = expenses?.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0) || 0
  const daysInMonthSoFar = date.getDate() || 1
  const dailyAverage = currentMonthTotal / daysInMonthSoFar
  const projectedSpend = dailyAverage * new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const categoryTotals = expenses?.reduce((acc: any, exp: any) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount)
    return acc
  }, {})
  
  const topCategory = categoryTotals ? Object.entries(categoryTotals).sort((a: any, b: any) => b[1] - a[1])[0] : null

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-sm font-medium text-slate-400">Welcome back</h2>
          <h1 className="text-3xl font-bold mt-1">Dashboard</h1>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Monthly Spend" value={formatINR(currentMonthTotal)} icon={Wallet} />
        <StatCard title="Daily Average" value={formatINR(dailyAverage)} icon={Activity} />
        <StatCard title="Projected Spend" value={formatINR(projectedSpend)} icon={Target} />
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-sm text-slate-400 font-medium">Top Category</span>
          <div className="mt-2">
            <p className="text-xl font-bold truncate">{topCategory ? topCategory[0] : 'N/A'}</p>
            <p className="text-sm text-slate-500 mt-1">{topCategory ? formatINR(topCategory[1] as number) : '₹0'}</p>
          </div>
        </div>
      </div>

      <section className="bg-indigo-950/30 border border-indigo-500/20 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2 mb-4">
          <Activity size={18}/> Financial Insights
        </h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
            <p>At the current spending rate, your projected monthly spending is <strong className="text-white">{formatINR(projectedSpend)}</strong>.</p>
          </li>
          {topCategory && (
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
              <p>Your highest expense area this month is <strong className="text-white">{topCategory[0]}</strong>.</p>
            </li>
          )}
        </ul>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <Link href="/expenses" className="text-indigo-400 text-sm hover:text-indigo-300">View All</Link>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
          {expenses?.slice(0, 5).map((exp: any) => (
            <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-sm font-semibold">
                  {exp.category.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{exp.description}</p>
                  <p className="text-xs text-slate-500">{new Date(exp.expense_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {exp.payment_method}</p>
                </div>
              </div>
              <p className="font-semibold text-lg">{formatINR(Number(exp.amount))}</p>
            </div>
          ))}
          {!expenses?.length && (
            <div className="p-8 text-center text-slate-500">No expenses recorded this month.</div>
          )}
        </div>
      </section>
    </div>
  )
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        <Icon size={16} className="text-slate-500" />
      </div>
      <p className="text-2xl md:text-3xl font-bold tracking-tight">{value}</p>
    </div>
  )
}    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-sm font-medium text-slate-400">Welcome back</h2>
          <h1 className="text-3xl font-bold mt-1">Dashboard</h1>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Monthly Spend" value={formatINR(currentMonthTotal)} icon={Wallet} />
        <StatCard title="Daily Average" value={formatINR(dailyAverage)} icon={Activity} />
        <StatCard title="Projected Spend" value={formatINR(projectedSpend)} icon={Target} />
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-sm text-slate-400 font-medium">Top Category</span>
          <div className="mt-2">
            <p className="text-xl font-bold truncate">{topCategory ? topCategory[0] : 'N/A'}</p>
            <p className="text-sm text-slate-500 mt-1">{topCategory ? formatINR(topCategory[1] as number) : '₹0'}</p>
          </div>
        </div>
      </div>

      {/* Financial Insights (Deterministic calculations) */}
      <section className="bg-indigo-950/30 border border-indigo-500/20 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2 mb-4">
          <Activity size={18}/> Financial Insights
        </h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
            <p>At the current spending rate, your projected monthly spending is <strong className="text-white">{formatINR(projectedSpend)}</strong>.</p>
          </li>
          {topCategory && (
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
              <p>Your highest expense area this month is <strong className="text-white">{topCategory[0]}</strong>, accounting for {Math.round(((topCategory[1] as number) / currentMonthTotal) * 100)}% of your budget.</p>
            </li>
          )}
        </ul>
      </section>

      {/* Recent Expenses List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <Link href="/expenses" className="text-indigo-400 text-sm hover:text-indigo-300">View All</Link>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
          {expenses?.slice(0, 5).map(exp => (
            <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-sm font-semibold">
                  {exp.category.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{exp.description}</p>
                  <p className="text-xs text-slate-500">{new Date(exp.expense_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {exp.payment_method}</p>
                </div>
              </div>
              <p className="font-semibold text-lg">{formatINR(Number(exp.amount))}</p>
            </div>
          ))}
          {!expenses?.length && (
            <div className="p-8 text-center text-slate-500">No expenses recorded this month.</div>
          )}
        </div>
      </section>
    </div>
  )
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        <Icon size={16} className="text-slate-500" />
      </div>
      <p className="text-2xl md:text-3xl font-bold tracking-tight">{value}</p>
    </div>
  )
}
