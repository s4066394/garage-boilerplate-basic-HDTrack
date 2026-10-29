'use client'

import Link from 'next/link'
import { LayoutDashboard, User, Settings, Package } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Sidebar() {
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
    isAdmin
      ? { href: '/admin-equipment', label: 'Equipment Approvals', icon: Package }
      : { href: '/equipment', label: 'Equipment', icon: Package },
  ]

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-14 items-center border-b border-zinc-200 px-4">
        <span className="text-sm font-semibold text-zinc-900">
          {process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
