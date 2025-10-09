import { useState } from 'react'
import reactLogo from './assets/react.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center space-y-6">
        <div className="flex justify-center space-x-4 mb-6">
          <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
            <img src={reactLogo} className="h-16 w-16 animate-spin" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ieee-links
        </h1>
        
        <p className="text-gray-600 mb-6">
          Vite + React + TypeScript + Tailwind CSS v4
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold 
                     hover:bg-indigo-700 transition-colors transform hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Count is {count}
          </button>
          
          <p className="text-sm text-gray-500">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-indigo-600 font-mono">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
