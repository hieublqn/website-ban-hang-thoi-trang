import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

function load() {
  try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load) // [{MaSP, TenSP, Gia, HinhAnh, SoLuongTon, SoLuong}]
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items])

  // Tự ẩn thông báo sau ít giây
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const add = (p, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.MaSP === p.MaSP)
      if (found) {
        return cur.map((i) => i.MaSP === p.MaSP ? { ...i, SoLuong: Math.min(i.SoLuong + qty, p.SoLuongTon) } : i)
      }
      const { MaSP, TenSP, Gia, HinhAnh, SoLuongTon } = p
      return [...cur, { MaSP, TenSP, Gia, HinhAnh, SoLuongTon, SoLuong: Math.min(qty, SoLuongTon) }]
    })
    setToast(`Đã thêm "${p.TenSP}" vào giỏ hàng`)
  }
  const setQty = (id, q) =>
    setItems((cur) => cur.map((i) => i.MaSP === id ? { ...i, SoLuong: Math.max(1, Math.min(q, i.SoLuongTon)) } : i))
  const remove = (id) => setItems((cur) => cur.filter((i) => i.MaSP !== id))
  const clear = () => setItems([])

  const count = items.reduce((s, i) => s + i.SoLuong, 0)
  const total = items.reduce((s, i) => s + i.SoLuong * Number(i.Gia), 0)

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total, toast }}>
      {children}
    </CartContext.Provider>
  )
}
