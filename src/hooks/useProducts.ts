import { useEffect, useState } from 'react'
import type { Product } from '../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    let active = true

    fetch('https://fakestoreapi.com/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }
        return response.json()
      })
      .then((data) => {
        if (!active) return
        setProducts(data as Product[])
        setStatus('success')
      })
      .catch(() => {
        if (!active) return
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  return { products, status }
}
