import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { CartItem } from '../types/product'

type CartContextValue = {
  items: CartItem[]
  totalQuantity: number
  addItem: (item: CartItem) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const CART_STORAGE_KEY = 'pdp-cart-state-v1'
const USER_ID = 1
const CART_API = 'https://fakestoreapi.com/carts'

function makeCartPayload(items: CartItem[]) {
  return {
    userId: USER_ID,
    date: new Date().toISOString().slice(0, 10),
    products: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, [])
  const [remoteCartId, setRemoteCartId] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    fetch(`${CART_API}/user/${USER_ID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load cart from API')
        }
        return response.json()
      })
      .then((data) => {
        if (!active || !Array.isArray(data) || data.length === 0) {
          return
        }

        const latestCart = data.reduce((latest: any, cart: any) => {
          return new Date(cart.date) > new Date(latest.date) ? cart : latest
        }, data[0])

        if (latestCart?.id) {
          setRemoteCartId(latestCart.id)
        }
      })
      .catch(() => {
        // Keep local state if API fetch fails.
      })

    return () => {
      active = false
    }
  }, [])

  const syncCartToApi = useCallback(
    (currentItems: CartItem[], cartId: number | null) => {
      const payload = makeCartPayload(currentItems)
      const method = cartId ? 'PUT' : 'POST'
      const url = cartId ? `${CART_API}/${cartId}` : CART_API

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to sync cart')
          }
          return response.json()
        })
        .then((data) => {
          if (data?.id) {
            setRemoteCartId(data.id)
          }
        })
        .catch(() => {
          // Network failure is tolerated; local persistence remains.
        })
    },
    [],
  )

  useEffect(() => {
    if (items.length === 0 && remoteCartId === null) {
      return
    }

    syncCartToApi(items, remoteCartId)
  }, [items, remoteCartId, syncCartToApi])

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((current) => {
        const existingIndex = current.findIndex(
          (cartItem) =>
            cartItem.productId === item.productId &&
            cartItem.color === item.color &&
            cartItem.size === item.size,
        )

        if (existingIndex >= 0) {
          const next = [...current]
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + item.quantity,
          }
          return next
        }

        return [...current, item]
      })
    },
    [setItems],
  )

  return (
    <CartContext.Provider value={{ items, totalQuantity, addItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
