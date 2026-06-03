import { useEffect, useState } from 'react'
import type { Product } from '../types/product'

export function useProduct(productId = 20) {
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    let ignore = false
    setStatus('loading')

    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load product')
        }
        return response.json()
      })
      .then((data) => {
        if (!ignore) {
          setProduct(data as Product)
          setStatus('success')
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [productId])

  return { product, status }
}
