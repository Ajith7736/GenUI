'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
// session provider for nextauth
export default function SessionWrapper({ children, session }: { children: ReactNode, session?: Session | null | undefined }) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
