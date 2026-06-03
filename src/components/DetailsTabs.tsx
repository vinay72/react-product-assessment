import { useState } from 'react'
import type { Review } from '../types/product'
import styles from './DetailsTabs.module.scss'

type Spec = {
  label: string
  value: string
}

type Props = {
  description: string
  specifications: Spec[]
  reviews: Review[]
}

const tabs = ['Description', 'Specifications', 'Reviews'] as const

type TabKey = (typeof tabs)[number]

export default function DetailsTabs({ description, specifications, reviews }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('Description')

  return (
    <section className={styles.detailsSection}>
      <div className={styles.tabList} role="tablist" aria-label="Product details tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabPanel} role="tabpanel">
        {activeTab === 'Description' && <p>{description}</p>}

        {activeTab === 'Specifications' && (
          <dl className={styles.specTable}>
            {specifications.map((item) => (
              <div key={item.label} className={styles.specRow}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {activeTab === 'Reviews' && (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <h4>{review.title}</h4>
                <p className={styles.reviewMeta}>
                  {review.author} · {String(review.rating)} / 5
                </p>
                <p>{review.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
