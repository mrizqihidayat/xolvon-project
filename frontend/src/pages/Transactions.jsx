import { useState, useEffect } from 'react'
import { Filter, Download, X, Receipt, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTransactions, getTransaction } from '../lib/api'

const fmtRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')

const fmtDate = (s) => {
  if (!s) return '-'
  const d = new Date(s)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function MethodBadge({ method }) {
  const styles = {
    QRIS:  'bg-blue-100 text-blue-700',
    Cash:  'bg-green-100 text-green-700',
    Debit: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${styles[method] || 'bg-gray-100 text-gray-600'}`}>
      {method}
    </span>
  )
}

function ReceiptModal({ detail, onClose }) {
  if (!detail) return null

  const txId = String(detail.id).slice(0, 8).toUpperCase()
  const items = detail.transaction_items || []
  const total = detail.total_amount

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Receipt size={16} className="text-blue-600" />
            <span className="font-bold text-gray-800 text-sm">Transaction Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="flex flex-col items-center py-6 px-5 border-b border-dashed border-gray-200">
            <h2 className="font-bold text-gray-900 text-lg tracking-widest uppercase">Xolvon Project</h2>
          </div>

          <div className="px-5 py-4 border-b border-dashed border-gray-200">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400 font-medium">Transaction ID</span>
              <span className="text-gray-800 font-bold">#{txId}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400 font-medium">Date & Time</span>
              <span className="text-gray-800 font-medium text-right">{fmtDate(detail.created_at)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Payment</span>
              <MethodBadge method={detail.payment_method} />
            </div>
          </div>

          <div className="px-5 py-4 border-b border-dashed border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</p>
            <div className="space-y-3">
              {items.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">Tidak ada item</p>
              )}
              {items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                      {item.products?.name || `Product #${item.product_id}`}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {item.quantity} × {fmtRp(item.price)}
                    </p>
                  </div>
                  <span className="text-[13px] font-bold text-gray-800 shrink-0">
                    {fmtRp(item.subtotal ?? item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 border-b border-dashed border-gray-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-700 font-medium">{fmtRp(total)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Discount</span>
              <span className="text-gray-700 font-medium">Rp 0</span>
            </div>
            <div className="flex justify-between text-sm pt-1 border-t border-gray-100 mt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-blue-600 text-base">{fmtRp(total)}</span>
            </div>
          </div>

          <div className="px-5 py-5 flex flex-col items-center gap-2">
            {/* Fake barcode lines */}
            <div className="flex items-end gap-px h-10 mb-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800"
                  style={{
                    width: i % 3 === 0 ? '3px' : '1.5px',
                    height: i % 5 === 0 ? '100%' : i % 2 === 0 ? '70%' : '85%',
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest">{txId}-{detail.id?.slice(-4).toUpperCase()}</p>
            <p className="text-[10px] text-gray-400 text-center">Terima kasih telah berbelanja! 🎉</p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [receiptDetail, setReceiptDetail] = useState(null)
  const [loadingId, setLoadingId] = useState(null)

  const load = () => {
    setLoading(true)
    getTransactions()
      .then(setTransactions)
      .catch(() => toast.error('Gagal memuat transaksi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDetail = async (tx) => {
    setLoadingId(tx.id)
    try {
      const data = await getTransaction(tx.id)
      setReceiptDetail(data)
    } catch {
      toast.error('Gagal memuat detail transaksi')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Transactions History</h1>
          <p className="text-xs text-gray-500 mt-0.5">View and manage past sales</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <Filter size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[28%]" />
                <col className="w-[18%]" />
                <col className="w-[18%]" />
                <col className="w-[14%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tx ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date &amp; Time</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-blue-600 text-[13px]">
                        #{String(tx.id).slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs">{fmtDate(tx.created_at)}</td>
                    <td className="px-5 py-3.5"><MethodBadge method={tx.payment_method} /></td>
                    <td className="px-5 py-3.5 font-bold text-gray-800 text-[13px]">{fmtRp(tx.total_amount)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDetail(tx)}
                        disabled={loadingId === tx.id}
                        className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-semibold disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {loadingId === tx.id ? (
                          <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Receipt size={12} />
                        )}
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactions.length === 0 && (
              <div className="py-16 flex flex-col items-center text-gray-400 gap-2">
                <span className="text-4xl">🧾</span>
                <p className="text-sm font-medium">Belum ada transaksi</p>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Showing 1–{transactions.length} of {transactions.length} entries
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(p => (
                    <button key={p} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${p === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                      {p}
                    </button>
                  ))}
                  <span className="text-gray-400 text-xs px-1">›</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {receiptDetail && (
        <ReceiptModal
          detail={receiptDetail}
          onClose={() => setReceiptDetail(null)}
        />
      )}
    </div>
  )
}
