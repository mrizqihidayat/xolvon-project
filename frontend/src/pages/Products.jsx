import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../lib/api'

const CATEGORIES = ['Coffee', 'Food', 'Dessert', 'Drinks', 'Snacks']
const fmtRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')

function Modal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    name: '', category: 'Coffee', price: '', stock: '', image_url: '', is_active: true,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock) {
      toast.error('Nama, harga, dan stok wajib diisi')
      return
    }
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">{initial ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Produk</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Contoh: Caffe Latte"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
              <select
                value={form.is_active ? 'active' : 'inactive'}
                onChange={e => set('is_active', e.target.value === 'active')}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Harga (Rp)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="35000"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stok</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => set('stock', e.target.value)}
                placeholder="50"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL Gambar (opsional)</label>
            <input
              value={form.image_url}
              onChange={e => set('image_url', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              {initial ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | {product}
  const [filterCat, setFilterCat] = useState('All')

  const load = () => {
    getAllProducts()
      .then(setProducts)
      .catch(() => toast.error('Gagal memuat produk'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = filterCat === 'All' ? products : products.filter(p => p.category === filterCat)

  const handleSave = async (form) => {
    try {
      if (modal && modal.id) {
        await updateProduct(modal.id, form)
        toast.success('Produk diperbarui!')
      } else {
        await createProduct(form)
        toast.success('Produk ditambahkan!')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return
    try {
      await deleteProduct(id)
      toast.success('Produk dihapus!')
      load()
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus')
    }
  }

  const handleToggleActive = async (product) => {
    try {
      await updateProduct(product.id, { ...product, is_active: !product.is_active })
      load()
    } catch (err) {
      toast.error('Gagal mengubah status')
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Products</h1>
          <p className="text-xs text-gray-500 mt-0.5">Kelola dan atur produk</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={15} />
          Tambah Produk
        </button>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-3 flex items-center gap-1.5 shrink-0">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              filterCat === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-2 text-xs text-gray-400">{filtered.length} items</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">🍽️</div>
                        )}
                        <span className="font-semibold text-gray-800 text-[13px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full font-medium">{p.category}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-amber-600 font-semibold text-[13px]">{fmtRp(p.price)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[13px] font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-gray-700'}`}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} pcs`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${p.is_active ? 'bg-teal-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform shadow ${p.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModal(p)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 flex flex-col items-center text-gray-400 gap-2">
                <span className="text-4xl">📦</span>
                <p className="text-sm font-medium">Tidak ada produk</p>
              </div>
            )}
          </div>
        )}
      </div>

      {modal && (
        <Modal
          onClose={() => setModal(null)}
          onSave={handleSave}
          initial={modal !== 'add' ? modal : null}
        />
      )}
    </div>
  )
}
