import type { ColorOption, Review } from '../types/product'

export const COLORS: ColorOption[] = [
  { id: 'forest', label: 'Forest Green', hex: '#2F6F49' },
  { id: 'sand', label: 'Desert Sand', hex: '#D4B27E' },
  { id: 'stone', label: 'Stone Gray', hex: '#767A7C' },
  { id: 'midnight', label: 'Midnight Blue', hex: '#1F3C6E' },
]

export const SIZES = ['S', 'M', 'L', 'XL'] as const

export const STOCK_MATRIX: Record<string, Record<string, number>> = {
  forest: { S: 8, M: 2, L: 0, XL: 4 },
  sand: { S: 0, M: 3, L: 2, XL: 1 },
  stone: { S: 5, M: 5, L: 4, XL: 0 },
  midnight: { S: 2, M: 1, L: 0, XL: 0 },
}

export const FAVORITE_SPECS = [
  { label: 'Weight', value: '1.7 kg' },
  { label: 'Material', value: 'Ripstop nylon, DWR finish' },
  { label: 'Water resistance', value: '20,000 mm' },
  { label: 'Recommended use', value: 'High-altitude hiking, alpine camping' },
  { label: 'Warranty', value: '2 years' },
]

export const REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Harper J.',
    rating: 5,
    title: 'Feels built for the outdoors',
    body: 'The jacket is solid, warm, and the fabric handles wind and rain without feeling heavy. The fit is true to size.',
  },
  {
    id: 2,
    author: 'Mina R.',
    rating: 4,
    title: 'Great performance, love the color',
    body: 'The zipper and pockets are thoughtful, and the color swatches in the fourth photo are accurate. Only thing missing is a packable pouch.',
  },
  {
    id: 3,
    author: 'Noah S.',
    rating: 4,
    title: 'Excellent warmth with low bulk',
    body: 'I grabbed it for a camping trip and it held up. One size felt slightly roomy, so size down if you want a trim fit.',
  },
]

export const PRODUCT_META = {
  brand: 'Summit Ridge',
  headline: 'Premium Alpine Shell Jacket',
  onSale: true,
  discountPercent: 18,
  deliveryEstimate: 'Delivery in 2–4 business days',
}

export const getVariantStock = (colorId: string, size: string) => {
  return STOCK_MATRIX[colorId]?.[size] ?? 0
}

export const isLowStock = (stock: number) => stock > 0 && stock <= 2
export const isSoldOut = (stock: number) => stock === 0
