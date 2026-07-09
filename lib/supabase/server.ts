import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Intentionally left blank. 
          // Cookie modification during pure page renders is handled entirely by middleware.ts
        },
        remove(name: string, options: any) {
          // Intentionally left blank.
          // Cookie modification during pure page renders is handled entirely by middleware.ts
        },
      },
    }
  )
}
