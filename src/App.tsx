import { useState } from 'react';
import './App.css';
import Unicode from "./Unicode";

function App() {
  const [input, setInput] = useState("")

  return (
    <div className="App">
      <header className="App-header">
        <h1 >
          Markdown to Unicode Converter
        </h1>

        <textarea
          rows={6}
          style={{ width: "100%", marginBottom: "10px" }}
          placeholder='Type or paste your markdown here'
          value={input}
          onChange={e => setInput(e.target.value) }
        />

      <Unicode input={input} />
      </header>
    </div>
  );
}

export default App;
