'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Wallet } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/add', label: 'Add Expense', icon: PlusCircle },
  ]

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
          <Wallet className="h-5 w-5 text-indigo-500" />
          <span>Paisa<span className="text-indigo-500">OS</span></span>
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}      </aside>

      {/* Mobile Bottom Navigation (iPhone Optimised) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            // Special treatment for the main Add button to make it easily reachable
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
