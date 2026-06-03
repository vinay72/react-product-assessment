import type { Product } from '../types/product'
import styles from './ProductList.module.scss'

type Props = {
  products: Product[]
  selectedProductId: number
  onSelect: (productId: number) => void
}

export default function ProductList({ products, selectedProductId, onSelect }: Props) {
  return (
    <section className={styles.productList} aria-label="Other products from Fake Store API">
      <h2 className={styles.heading}>More outdoor gear</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            className={
              product.id === selectedProductId
                ? `${styles.card} ${styles.active}`
                : styles.card
            }
            onClick={() => onSelect(product.id)}
          >
            <img src={product.image} alt={product.title} className={styles.image} />
            <div className={styles.content}>
              <p className={styles.title}>{product.title}</p>
              <p className={styles.price}>${product.price.toFixed(2)}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
