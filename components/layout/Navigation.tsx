'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, List, BarChart2, Target } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Add', href: '/add', icon: PlusCircle },
  { name: 'Expenses', href: '/expenses', icon: List },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Goals', href: '/goals', icon: Target },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 bg-slate-900 border-r border-slate-800 p-4 z-40">
        <div className="text-2xl font-bold tracking-tighter mb-8 text-white px-2 mt-4">FinTrack.</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-50'
                }`}>
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation (iPhone Optimised) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            if (item.name === 'Add') {
              return (
                <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center -mt-6">
                  <div className="bg-indigo-600 p-3 rounded-full shadow-lg border-4 border-slate-950">
                    <Icon size={24} className="text-white" />
                  </div>
                </Link>
              )
            }
            return (
              <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`}>
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
