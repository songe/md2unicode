import { useState } from "react"

interface UnicodeProps {
  input: string
  onClear: () => void
}

// Active format bitmasks for efficiency
const BOLD = 1 << 0          // 1
const ITALIC = 1 << 1        // 2
const STRIKETHROUGH = 1 << 2 // 4

const OFFSETS = {
  bold: { upper: 0x1D3BF, lower: 0x1D3B9 },
  italic: { upper: 0x1D3F3, lower: 0x1D3ED },
  boldItalic: { upper: 0x1D427, lower: 0x1D421 }
}

function transformChar(char: string, styleMask: number): string {
  let result = char
  const isBold = (styleMask & BOLD) !== 0
  const isItalic = (styleMask & ITALIC) !== 0
  const isStrike = (styleMask & STRIKETHROUGH) !== 0

  if (isBold || isItalic) {
    const code = char.charCodeAt(0)
    let offset = null

    if (isBold && isItalic) offset = OFFSETS.boldItalic
    else if (isBold) offset = OFFSETS.bold
    else if (isItalic) offset = OFFSETS.italic

    if (offset) {
      if (code >= 65 && code <= 90) {
        result = String.fromCodePoint(code + offset.upper)
      } else if (code >= 97 && code <= 122) {
        result = String.fromCodePoint(code + offset.lower)
      }
    }
  }

  // Strikethrough uses combining unicode overlay (U+0336)
  if (isStrike) {
    result += "\u0336"
  }

  return result
}

export function parseMarkdownUnicode(input: string): string {
  const len = input.length
  let i = 0
  let activeStyles = 0
  const output: string[] = []

  while (i < len) {
    // 1. Check for ~~ (Strikethrough)
    if (input[i] === "~" && input[i + 1] === "~") {
      activeStyles ^= STRIKETHROUGH // Toggle bit flag
      i += 2
      continue
    }

    // 2. Check for *** or ___ (Bold + Italic)
    if (
      (input[i] === "*" && input[i + 1] === "*" && input[i + 2] === "*") ||
      (input[i] === "_" && input[i + 1] === "_" && input[i + 2] === "_")
    ) {
      activeStyles ^= (BOLD | ITALIC)
      i += 3
      continue
    }

    // 3. Check for ** or __ (Bold)
    if (
      (input[i] === "*" && input[i + 1] === "*") ||
      (input[i] === "_" && input[i + 1] === "_")
    ) {
      activeStyles ^= BOLD
      i += 2
      continue
    }

    // 4. Check for * or _ (Italic)
    if (input[i] === "*" || input[i] === "_") {
      activeStyles ^= ITALIC
      i += 1
      continue
    }

    // 5. Standard Character Processing
    output.push(transformChar(input[i], activeStyles))
    i++
  }

  return output.join("")
}

export default function Unicode({ input, onClear }: UnicodeProps) {
  const unicodeOutput = parseMarkdownUnicode(input)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!unicodeOutput) return
    navigator.clipboard.writeText(unicodeOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="input-group">
      <div className="output-header">
        <label htmlFor="unicode-output">Unicode Output</label>
        <div className="button-group">
          <button
            className="secondary-button"
            onClick={onClear}
            disabled={!input}
          >
            Clear
          </button>
          <button
            className="copy-button"
            onClick={handleCopy}
            disabled={!unicodeOutput}
          >
            {copied ? "Copied!" : "Copy Text"}
          </button>
        </div>
      </div>
      <textarea
        id="unicode-output"
        readOnly
        placeholder="Converted output will appear here..."
        value={unicodeOutput}
      />
    </div>
  )
}
