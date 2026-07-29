import { useState, useEffect } from 'react'
import { Plus, Minus, CreditCard, ChevronUp, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getActiveProducts, checkout } from '../lib/api'
import { useCartStore } from '../store/cartStore'

const CATEGORIES = ['All', 'Coffee', 'Food', 'Dessert']

const fmtRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')

function ProductCard({ product }) {
  const { addItem, items } = useCartStore()
  const cartItem = items.find(i => i.product_id === product.id)
  const qty = cartItem?.quantity ?? 0
  const isMaxed = qty >= product.stock
  const isPopular = product.name?.toLowerCase().includes('latte') ||
    product.name?.toLowerCase().includes('burger') ||
    product.name?.toLowerCase().includes('cappuccino')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">

      <div className="relative h-36 bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-100 to-gray-50">
            🍽️
          </div>
        )}
        {isPopular && (
          <span className="absolute top-0 right-0 bg-teal-600 text-white text-[9px] px-2 py-1 font-bold tracking-wider rounded-bl-xl">
            POPULAR
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] px-2 py-1 rounded-full font-semibold">
            Sisa {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-xs bg-white px-3 py-1 rounded-full shadow">Habis</span>
          </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        <h3 className="font-semibold text-gray-800 text-[13px] leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-amber-500 font-semibold text-[13px]">{fmtRp(product.price)}</span>
          {qty === 0 ? (
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => useCartStore.getState().removeItem(product.id)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold w-4 text-center text-gray-800">{qty}</span>
              <button
                onClick={() => addItem(product)}
                disabled={isMaxed}
                className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [checkingOut, setCheckingOut] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [cartOpen, setCartOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  const { items, clearCart, totalItems, totalAmount } = useCartStore()

  useEffect(() => {
    getActiveProducts()
      .then(setProducts)
      .catch(() => toast.error('Gagal memuat produk'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setCheckingOut(true)
    try {
      const cartItems = items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
      await checkout(cartItems, paymentMethod)
      toast.success('Checkout berhasil! 🎉')
      clearCart()
      setCartOpen(false)
      setIsCheckoutModalOpen(false)
      const updated = await getActiveProducts()
      setProducts(updated)
    } catch (err) {
      toast.error(err.message || 'Checkout gagal')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                    : 'text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <span className="text-5xl">📦</span>
            <p className="font-medium text-sm">Tidak ada produk</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Slide-up Cart Panel */}
      {cartOpen && (
        <div className="absolute bottom-[57px] left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] z-20 max-h-72 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
              <span className="text-3xl">🛒</span>
              <p className="text-xs font-medium">Keranjang kosong</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm shrink-0">🍽️</div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800">{item.name}</p>
                      <p className="text-[11px] text-gray-400">{fmtRp(item.price)} / pcs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => useCartStore.getState().removeItem(item.product_id)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-xs font-bold"
                      >−</button>
                      <span className="text-xs font-bold w-5 text-center text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => useCartStore.getState().addItem({ id: item.product_id, name: item.name, price: item.price, stock: item.stock })}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-bold"
                      >+</button>
                    </div>
                    <span className="text-[13px] font-bold text-gray-800 w-20 text-right">
                      {fmtRp(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-20">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCartOpen(o => !o)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronUp
              size={15}
              className={`text-gray-400 transition-transform duration-200 ${cartOpen ? 'rotate-180' : ''}`}
            />
            <span className="text-xs font-semibold">View Cart ({totalItems()})</span>
          </button>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Amount</p>
            <p className="text-blue-600 font-bold text-lg leading-none">{fmtRp(totalAmount())}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { clearCart(); setCartOpen(false) }}
            disabled={items.length === 0}
            className="text-xs text-red-500 hover:text-red-600 font-semibold disabled:opacity-40 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            disabled={items.length === 0 || checkingOut}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard size={15} />
            Checkout
          </button>
        </div>
      </div>
      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Items Summary */}
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.product_id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 w-6">{item.quantity}x</span>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{fmtRp(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-6">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">{fmtRp(totalAmount())}</span>
              </div>

              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Cash', 'QRIS', 'Debit'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      paymentMethod === method 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="flex-[2] flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm shadow-teal-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard size={16} />
                {checkingOut ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
