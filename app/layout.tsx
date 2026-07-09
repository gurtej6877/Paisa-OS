import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'
import CommandBar from '@/components/layout/CommandBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FinTrack | Personal Ledger',
  description: 'Fast, secure personal expense tracking.',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FinTrack',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      {/* Elaborated Mobile Optimisation: 
        touch-manipulation prevents double-tap zoom.
        text-[16px] (enforced in globals.css) prevents Safari auto-zoom on inputs. 
      */}
      <body className={`${inter.className} bg-slate-950 text-slate-50 touch-manipulation antialiased pb-20 md:pb-0`}>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Navigation />
          <main className="flex-1 overflow-x-hidden p-4 md:p-8 md:ml-64 safe-area-pt">
            {children}
          </main>
        </div>
        <CommandBar />
      </body>
    </html>
  )
}
