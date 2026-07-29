import { Search } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-64 bg-gray-100 rounded-full py-1.5 pl-8 pr-4 text-xs font-medium text-gray-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 transition-all placeholder-gray-400 border border-transparent focus:border-blue-300"
          />
        </div>
      </div>
    </header>
  )
}
