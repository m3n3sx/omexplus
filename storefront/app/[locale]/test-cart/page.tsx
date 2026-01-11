'use client'

import { useState } from 'react'

const BACKEND_URL = 'http://localhost:9000'
const API_KEY = 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'
const REGION_ID = 'reg_01KBDXHQAFG1GS7F3WH2680KP0'
const TEST_VARIANT = 'variant_mjxy8pno_v7bfgmj82'

export default function TestCartPage() {
  const [log, setLog] = useState<string[]>([])
  const [cartId, setCartId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const addLog = (msg: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const createCart = async () => {
    setLoading(true)
    addLog('Creating cart...')
    
    try {
      const response = await fetch(`${BACKEND_URL}/store/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': API_KEY,
        },
        body: JSON.stringify({ region_id: REGION_ID }),
      })

      addLog(`Response status: ${response.status}`)
      
      const text = await response.text()
      addLog(`Response: ${text.substring(0, 200)}...`)

      if (response.ok) {
        const data = JSON.parse(text)
        setCartId(data.cart.id)
        addLog(`✅ Cart created: ${data.cart.id}`)
        localStorage.setItem('test_cart_id', data.cart.id)
      } else {
        addLog(`❌ Error: ${text}`)
      }
    } catch (error: any) {
      addLog(`❌ Fetch error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async () => {
    if (!cartId) {
      addLog('No cart - create one first')
      return
    }

    setLoading(true)
    addLog(`Adding item to cart ${cartId}...`)

    try {
      const response = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': API_KEY,
        },
        body: JSON.stringify({
          variant_id: TEST_VARIANT,
          quantity: 1,
        }),
      })

      addLog(`Response status: ${response.status}`)
      
      const text = await response.text()
      addLog(`Response: ${text.substring(0, 300)}...`)

      if (response.ok) {
        const data = JSON.parse(text)
        addLog(`✅ Item added! Total: ${data.cart.total / 100} PLN`)
        addLog(`Items in cart: ${data.cart.items.length}`)
      } else {
        addLog(`❌ Error: ${text}`)
      }
    } catch (error: any) {
      addLog(`❌ Fetch error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getCart = async () => {
    const id = cartId || localStorage.getItem('test_cart_id')
    if (!id) {
      addLog('No cart ID')
      return
    }

    setLoading(true)
    addLog(`Getting cart ${id}...`)

    try {
      const response = await fetch(`${BACKEND_URL}/store/carts/${id}`, {
        headers: {
          'x-publishable-api-key': API_KEY,
        },
      })

      const text = await response.text()
      
      if (response.ok) {
        const data = JSON.parse(text)
        setCartId(data.cart.id)
        addLog(`✅ Cart loaded: ${data.cart.items.length} items, total: ${data.cart.total / 100} PLN`)
      } else {
        addLog(`❌ Error: ${text}`)
      }
    } catch (error: any) {
      addLog(`❌ Fetch error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearLog = () => setLog([])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛒 Test Cart API</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <p><strong>Backend:</strong> {BACKEND_URL}</p>
        <p><strong>API Key:</strong> {API_KEY.substring(0, 20)}...</p>
        <p><strong>Region:</strong> {REGION_ID}</p>
        <p><strong>Test Variant:</strong> {TEST_VARIANT}</p>
        <p><strong>Current Cart:</strong> {cartId || 'none'}</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={createCart}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          1. Create Cart
        </button>
        <button
          onClick={addItem}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          2. Add Item {cartId ? '✓' : '(create cart first)'}
        </button>
        <button
          onClick={getCart}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Get Cart
        </button>
        <button
          onClick={clearLog}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Clear Log
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-auto">
        {log.length === 0 ? (
          <p className="text-gray-500">Click buttons to test cart API...</p>
        ) : (
          log.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  )
}
