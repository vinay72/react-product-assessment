import type { ColorOption } from '../types/product'
import styles from './ProductInfoPanel.module.scss'

type Props = {
  brand: string
  title: string
  price: number
  salePrice: number
  onSale: boolean
  colors: ColorOption[]
  selectedColor: string
  onColorSelect: (colorId: string) => void
  sizes: readonly string[]
  selectedSize: string
  stockForSize: (size: string) => number
  onSizeSelect: (sizeId: string) => void
  quantity: number
  onQuantityChange: (value: number) => void
  onAddToCart: () => void
  disabled: boolean
  lowStock: boolean
  deliveryEstimate: string | null
  addedMessage: boolean
}

export default function ProductInfoPanel({
  brand,
  title,
  price,
  salePrice,
  onSale,
  colors,
  selectedColor,
  onColorSelect,
  sizes,
  selectedSize,
  stockForSize,
  onSizeSelect,
  quantity,
  onQuantityChange,
  onAddToCart,
  disabled,
  lowStock,
  deliveryEstimate,
  addedMessage,
}: Props) {
  return (
    <aside className={styles.panel}>
      <div className={styles.headingRow}>
        <p className={styles.brand}>{brand}</p>
        <div className={styles.priceGroup}>
          {onSale ? (
            <>
              <span className={styles.oldPrice}>${price.toFixed(2)}</span>
              <strong className={styles.salePrice}>${salePrice.toFixed(2)}</strong>
            </>
          ) : (
            <strong className={styles.salePrice}>${price.toFixed(2)}</strong>
          )}
        </div>
      </div>

      <h2 className={styles.title}>{title}</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Colour</h3>
        <div className={styles.swatchRow}>
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`${styles.swatch} ${selectedColor === color.id ? styles.selectedSwatch : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => onColorSelect(color.id)}
              aria-label={`Select ${color.label}`}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Size</h3>
        <div className={styles.sizeGrid}>
          {sizes.map((size) => {
            const stock = stockForSize(size)
            const soldOut = stock === 0
            const lowStock = stock > 0 && stock <= 2
            return (
              <button
                key={size}
                type="button"
                className={`${styles.sizeButton} ${selectedSize === size ? styles.activeSize : ''} ${soldOut ? styles.soldOut : ''}`}
                onClick={() => !soldOut && onSizeSelect(size)}
                disabled={soldOut}
                aria-pressed={selectedSize === size}
              >
                <span>{size}</span>
                {lowStock ? <small>Only {stock} left</small> : soldOut ? <small>Sold out</small> : null}
              </button>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Quantity</h3>
        <div className={styles.quantityGroup}>
          <button type="button" onClick={() => onQuantityChange(quantity - 1)} disabled={quantity <= 1}>
            –
          </button>
          <input
            type="number"
            value={quantity}
            min={1}
            max={stockForSize(selectedSize)}
            onChange={(event) => onQuantityChange(Number(event.target.value))}
            aria-label="Quantity"
          />
          <button type="button" onClick={() => onQuantityChange(quantity + 1)} disabled={quantity >= stockForSize(selectedSize)}>
            +
          </button>
        </div>
        {lowStock ? <p className={styles.lowStock}>Only a few left for this variant.</p> : null}
      </section>

      <button type="button" className={styles.addButton} onClick={onAddToCart} disabled={disabled}>
        {disabled ? 'Sold out' : 'Add to cart'}
      </button>

      {addedMessage ? <p className={styles.toast}>Added to cart</p> : null}
      {deliveryEstimate ? <p className={styles.delivery}>{deliveryEstimate}</p> : null}
      {disabled ? <p className={styles.delivery}>This variant is currently unavailable.</p> : null}
    </aside>
  )
}
