import { useState } from "react"
import "./App.css"
import Unicode from "./Unicode"

export default function App() {
  const [input, setInput] = useState("")

  const handleClear = () => {
    setInput("")
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>md2unicode</h1>
        <p className="app-subtitle">
          Convert Markdown syntax into styled Unicode text instantly
        </p>
      </header>

      <main className="converter-card">
        <div className="input-group">
          <label htmlFor="markdown-input">Markdown Input</label>
          <textarea
            id="markdown-input"
            placeholder="Type or paste **bold**, _italic_, or ~~strikethrough~~..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <Unicode input={input} onClear={handleClear} />
      </main>
    </div>
  )
}
