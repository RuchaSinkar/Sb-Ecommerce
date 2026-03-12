import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FaBeer } from 'react-icons/fa'
import './App.css'
import Products from './components/Products'
import ProductCard from './components/ProductCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Products/>
    </div>
  )
}

export default App;
