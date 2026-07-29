import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Receipt, Store } from 'lucide-react'

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products',     icon: Package,         label: 'Products' },
  { to: '/transactions', icon: Receipt,          label: 'Transactions' },
]

export default function Sidebar() {
  return (
    <aside className="w-[200px] bg-[#1a1d23] flex flex-col shrink-0 h-screen border-r border-[#252830]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#252830]">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Store size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-white font-bold text-[15px] tracking-wide">Xolvon Project</span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-[#252830] hover:text-gray-200'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#252830] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div className="overflow-hidden">
          <p className="text-gray-200 text-xs font-semibold leading-tight truncate">Store Manager</p>
          <p className="text-gray-500 text-[10px] truncate mt-0.5">Admin</p>
        </div>
      </div>
    </aside>
  )
}
