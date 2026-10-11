import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'

const CartContext = createContext(null)

const STORAGE_KEY = 'madonna-cart'
const MAX_QTY = 99

export const lineKey = (productId, sizeName) => `${productId}:${sizeName}`

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  // Only ids are saved, so photos and prices always come from products.js
  const [lines, setLines] = useState(load)
  const [isOpen, setIsOpen] = useState(false)
  const [bump, setBump] = useState(0) // changes on every add, to replay the bag animation

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage can be blocked in some in-app browsers; the bag still works
    }
  }, [lines])

  const items = useMemo(
    () =>
      lines
        .map(({ productId, sizeName, qty }) => {
          const product = products.find((p) => p.id === productId)
          const size = product?.sizes.find((s) => s.name === sizeName)
          if (!product || !size) return null
          return {
            key: lineKey(productId, sizeName),
            product,
            size,
            qty,
            lineTotal: size.price * qty,
          }
        })
        .filter(Boolean),
    [lines]
  )

  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0)

  const addMany = useCallback((entries) => {
    setLines((current) => {
      const next = current.map((line) => ({ ...line }))
      entries.forEach(({ productId, sizeName, qty = 1 }) => {
        const existing = next.find((l) => l.productId === productId && l.sizeName === sizeName)
        if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty)
        else next.push({ productId, sizeName, qty })
      })
      return next
    })
    setBump((b) => b + 1)
  }, [])

  const add = useCallback((productId, sizeName) => addMany([{ productId, sizeName }]), [addMany])

  const setQty = useCallback((key, qty) => {
    setLines((current) =>
      qty <= 0
        ? current.filter((l) => lineKey(l.productId, l.sizeName) !== key)
        : current.map((l) =>
            lineKey(l.productId, l.sizeName) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l
          )
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const qtyFor = (productId, sizeName) =>
    lines.find((l) => l.productId === productId && l.sizeName === sizeName)?.qty ?? 0

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = {
    items,
    count,
    total,
    bump,
    isOpen,
    add,
    addMany,
    setQty,
    clear,
    qtyFor,
    openCart,
    closeCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
