import styles from './ImageGallery.module.scss'

type Props = {
  images: string[]
  selectedIndex: number
  onSelectIndex: (index: number) => void
  altText: string
}

export default function ImageGallery({ images, selectedIndex, onSelectIndex, altText }: Props) {
  return (
    <section className={styles.gallery} aria-label="Product image gallery">
      <div className={styles.mainImageWrapper}>
        <img src={images[selectedIndex]} alt={altText} className={styles.mainImage} />
      </div>

      <div className={styles.thumbnailRow}>
        {images.map((src, index) => (
          <button
            key={src + index}
            type="button"
            className={
              index === selectedIndex
                ? `${styles.thumbnailButton} ${styles.active}`
                : styles.thumbnailButton
            }
            onClick={() => onSelectIndex(index)}
            aria-label={`Show image ${index + 1}`}
          >
            <img src={src} alt={`${altText} ${index + 1}`} className={styles.thumbnailImage} />
          </button>
        ))}
      </div>

      <div className={styles.dotIndicator}>
        {images.map((_, index) => (
          <span
            key={index}
            className={index === selectedIndex ? styles.dotActive : styles.dot}
          />
        ))}
      </div>
    </section>
  )
}
