import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../context/ChatContext'
import { useMascota } from '../../context/MascotaContext'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './ChatPage.module.css'
import ReactMarkdown from 'react-markdown'

export default function ChatPage() {
  const navigate = useNavigate()
  const { mensajes, loading, enviarMensaje, fetchHistorial, limpiarChat, resetLocal } = useChat()
  const { mascotaActiva } = useMascota()
  const { lang, t, toggleLang } = useLanguage()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (mascotaActiva) fetchHistorial(mascotaActiva.id)
    return () => resetLocal()
  }, [mascotaActiva])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const texto = input.trim()
    setInput('')
    await enviarMensaje(texto)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/home')}>←</button>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitle}>Kahu IA</span>
          {mascotaActiva && <span className={styles.headerSub}>{mascotaActiva.nombre}</span>}
        </div>
        <button className={styles.langBtn} onClick={toggleLang}>{lang === 'es' ? 'EN' : 'ES'}</button>
        <button className={styles.clearBtn} onClick={() => limpiarChat()}>🗑️</button>
      </header>

      <div className={styles.messages}>
        {mensajes.length === 0 && (
          <div className={styles.welcome}>
            <span className={styles.welcomeEmoji}>🐾</span>
            <p className={styles.welcomeText}>{t.chatWelcome}</p>
            {mascotaActiva && (
              <p className={styles.welcomeSub}>{t.chatContext} {mascotaActiva.nombre}</p>
            )}
          </div>
        )}
        {mensajes.map((msg, i) => (
          <div key={i} className={`${styles.message} ${msg.rol === 'user' ? styles.userMsg : styles.aiMsg}`}>
            {msg.rol === 'assistant' && <span className={styles.aiAvatar}>🤖</span>}
            <div className={styles.msgBubble}>
              <ReactMarkdown>{msg.mensaje}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.message} ${styles.aiMsg}`}>
            <span className={styles.aiAvatar}>🤖</span>
            <div className={styles.msgBubble}>
              <span className={styles.typing}>●●●</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chatPlaceholder}
          rows={1}
        />
        <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || loading}>
          ↑
        </button>
      </div>
    </div>
  )
}