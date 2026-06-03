export type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export type ColorOption = {
  id: string
  label: string
  hex: string
}

export type Review = {
  id: number
  author: string
  rating: number
  title: string
  body: string
}

export type CartItem = {
  productId: number
  productName: string
  color: string
  size: string
  quantity: number
  unitPrice: number
  image: string
}
