import { CartProvider } from './context/CartContext'
import ProductPage from './components/ProductPage.tsx'

function App() {
  return (
    <CartProvider>
      <ProductPage />
    </CartProvider>
  )
}

export default App
