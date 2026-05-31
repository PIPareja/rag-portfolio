import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy un asistente con información sobre el perfil de Pablo Pareja. ¿Qué quieres saber?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:3000/chat', {
        question: input
      })
      const assistantMessage: Message = {
        role: 'assistant',
        content: res.data.answer
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hubo un error al procesar tu pregunta. Intenta de nuevo.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'sans-serif',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#1a1a2e',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        Pablo Pareja — Portafolio IA
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: msg.role === 'user' ? '#1a1a2e' : 'white',
              color: msg.role === 'user' ? 'white' : '#333',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'white',
              color: '#999',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}>
              Pensando...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '12px'
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregunta algo sobre Pablo..."
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            resize: 'none',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#999' : '#1a1a2e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

export default App