import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useProduct } from '../hooks/useProduct'
import { useProducts } from '../hooks/useProducts'
import {
  COLORS,
  FAVORITE_SPECS,
  PRODUCT_META,
  REVIEWS,
  SIZES,
  getVariantStock,
  isLowStock,
  isSoldOut,
} from '../data/product-config'
import DetailsTabs from './DetailsTabs'
import ImageGallery from './ImageGallery'
import ProductInfoPanel from './ProductInfoPanel'
import ProductList from './ProductList'
import styles from './ProductPage.module.scss'

const QUERY_PRODUCT = 'product'
const QUERY_COLOR = 'color'
const QUERY_SIZE = 'size'

function getSearchParam(name: string) {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(name)
}

function getInitialProductId() {
  const rawProduct = getSearchParam(QUERY_PRODUCT)
  const parsed = Number(rawProduct)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 20
}

function isValidColor(value: string | null): value is string {
  return !!value && COLORS.some((color) => color.id === value)
}

function isValidSize(value: string | null): value is string {
  return !!value && SIZES.includes(value as typeof SIZES[number])
}

function getDefaultSize(colorId: string) {
  return SIZES.find((size) => getVariantStock(colorId, size) > 0) ?? SIZES[0]
}

function getInitialSelection() {
  const rawColor = getSearchParam(QUERY_COLOR)
  const chosenColor = isValidColor(rawColor) ? rawColor : COLORS[0].id
  const rawSize = getSearchParam(QUERY_SIZE)
  const chosenSize = isValidSize(rawSize) ? rawSize : null
  const finalSize = chosenSize && getVariantStock(chosenColor, chosenSize) >= 0 ? chosenSize : getDefaultSize(chosenColor)
  return { chosenColor, chosenSize: finalSize }
}

export default function ProductPage() {
  const { products, status: productsStatus } = useProducts()
  const [selectedProductId, setSelectedProductId] = useState(getInitialProductId)
  const { product, status } = useProduct(selectedProductId)
  const { addItem, totalQuantity } = useCart()
  const [selectedColor, setSelectedColor] = useState(getInitialSelection().chosenColor)
  const [selectedSize, setSelectedSize] = useState(getInitialSelection().chosenSize)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedMessage, setAddedMessage] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    params.set(QUERY_PRODUCT, String(selectedProductId))
    params.set(QUERY_COLOR, selectedColor)
    params.set(QUERY_SIZE, selectedSize)
    const search = params.toString()

    if (window.location.search !== `?${search}`) {
      window.history.replaceState(null, '', `${window.location.pathname}?${search}`)
    }
  }, [selectedProductId, selectedColor, selectedSize])

  useEffect(() => {
    if (products.length && !products.some((item) => item.id === selectedProductId)) {
      setSelectedProductId(products[0].id)
    }
  }, [products, selectedProductId])

  useEffect(() => {
    const stock = getVariantStock(selectedColor, selectedSize)
    if (quantity > stock) {
      setQuantity(Math.max(1, stock))
    }
  }, [selectedColor, selectedSize, quantity])

  const stock = useMemo(() => getVariantStock(selectedColor, selectedSize), [selectedColor, selectedSize])
  const salePrice = useMemo(() => product ? Number((product.price * (1 - PRODUCT_META.discountPercent / 100)).toFixed(2)) : 0, [product])
  const isLowStockVariant = isLowStock(stock)
  const soldOutVariant = isSoldOut(stock)

  const galleryImages = useMemo(() => {
    if (!product) return []
    return [product.image, product.image, product.image, product.image]
  }, [product])

  function handleProductSelect(productId: number) {
    setSelectedProductId(productId)
    setSelectedImageIndex(0)
    setSelectedColor(COLORS[0].id)
    setSelectedSize(getDefaultSize(COLORS[0].id))
    setQuantity(1)
  }

  function handleColorChange(colorId: string) {
    setSelectedColor(colorId)
    const nextSize = getDefaultSize(colorId)
    setSelectedSize(nextSize)
    setQuantity(1)
  }

  function handleSizeChange(sizeId: string) {
    setSelectedSize(sizeId)
    setQuantity(1)
  }

  function handleQuantityChange(value: number) {
    const clamped = Math.max(1, Math.min(stock, value))
    setQuantity(clamped)
  }

  function handleAddToCart() {
    if (!product || soldOutVariant) return
    addItem({
      productId: product.id,
      productName: product.title,
      color: COLORS.find((color) => color.id === selectedColor)?.label ?? selectedColor,
      size: selectedSize,
      quantity,
      unitPrice: salePrice,
      image: product.image,
    })
    setAddedMessage(true)
    setTimeout(() => setAddedMessage(false), 1800)
  }

  if (status === 'loading') {
    return <div className={styles.loading}>Loading product...</div>
  }

  if (status === 'error' || !product) {
    return <div className={styles.error}>Unable to load product. Please try again later.</div>
  }

  return (
    <main className={styles.productPage}>
      <header className={styles.header}>
        <div>
          <p className={styles.storeLabel}>Summit Ridge Outdoor</p>
          <h1 className={styles.pageTitle}>{product.title}</h1>
        </div>
        <div className={styles.cartBadge}>Cart {totalQuantity}</div>
      </header>

      {productsStatus === 'success' ? (
        <ProductList
          products={products}
          selectedProductId={selectedProductId}
          onSelect={handleProductSelect}
        />
      ) : productsStatus === 'loading' ? (
        <p className={styles.subtleMessage}>Loading more products…</p>
      ) : (
        <p className={styles.subtleMessage}>Unable to load other products.</p>
      )}

      <section className={styles.productGrid}>
        <ImageGallery
          images={galleryImages}
          selectedIndex={selectedImageIndex}
          onSelectIndex={setSelectedImageIndex}
          altText={product.title}
        />

        <ProductInfoPanel
          brand={PRODUCT_META.brand}
          title={product.title}
          price={product.price}
          salePrice={salePrice}
          onSale={PRODUCT_META.onSale}
          colors={COLORS}
          selectedColor={selectedColor}
          onColorSelect={handleColorChange}
          sizes={SIZES}
          selectedSize={selectedSize}
          stockForSize={(size: string) => getVariantStock(selectedColor, size)}
          onSizeSelect={handleSizeChange}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          disabled={soldOutVariant}
          lowStock={isLowStockVariant}
          deliveryEstimate={soldOutVariant ? null : PRODUCT_META.deliveryEstimate}
          addedMessage={addedMessage}
        />
      </section>

      <DetailsTabs description={product.description} specifications={FAVORITE_SPECS} reviews={REVIEWS} />
    </main>
  )
}
