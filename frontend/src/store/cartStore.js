import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],

  addItem(product) {
    const { items } = get()
    const existing = items.find(i => i.product_id === product.id)
    if (existing) {
      if (existing.quantity >= product.stock) return
      set({ items: items.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i) })
    } else {
      set({ items: [...items, { product_id: product.id, name: product.name, price: product.price, quantity: 1, stock: product.stock }] })
    }
  },

  removeItem(productId) {
    const { items } = get()
    const existing = items.find(i => i.product_id === productId)
    if (!existing) return
    if (existing.quantity <= 1) {
      set({ items: items.filter(i => i.product_id !== productId) })
    } else {
      set({ items: items.map(i => i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i) })
    }
  },

  clearCart() { set({ items: [] }) },

  totalItems() { return get().items.reduce((s, i) => s + i.quantity, 0) },
  totalAmount() { return get().items.reduce((s, i) => s + i.price * i.quantity, 0) },
}))
