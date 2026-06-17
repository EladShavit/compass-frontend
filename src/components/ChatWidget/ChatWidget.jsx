import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useTransactions } from '../../hooks/useTransactions'
import { useChat } from '../../hooks/useChat'
import styles from './ChatWidget.module.css'

export default function ChatWidget() {
  const { t, dir } = useLanguage()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const { transactions } = useTransactions(200)
  const { messages, loading, sendMessage, reset } = useChat(transactions)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [open, messages])

  async function handleSend(e) {
    e?.preventDefault()
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    await sendMessage(text)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.root} dir={dir}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={`material-symbols-outlined ${styles.headerIcon}`}>smart_toy</span>
              <div>
                <p className={styles.headerTitle}>{t('chat_title')}</p>
                <p className={styles.headerSub}>{t('chat_subtitle')}</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              {messages.length > 0 && (
                <button className={styles.iconBtn} onClick={reset} title={t('chat_clear')}>
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              )}
              <button className={styles.iconBtn} onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.empty}>
                <span className={`material-symbols-outlined ${styles.emptyIcon}`}>chat_bubble_outline</span>
                <p className={styles.emptyText}>{t('chat_empty')}</p>
                <div className={styles.suggestions}>
                  {['chat_suggest_1', 'chat_suggest_2', 'chat_suggest_3'].map(key => (
                    <button
                      key={key}
                      className={styles.suggestion}
                      onClick={() => sendMessage(t(key))}
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgAssistant}`}
              >
                {msg.role === 'assistant' && (
                  <span className={`material-symbols-outlined ${styles.msgIcon}`}>smart_toy</span>
                )}
                <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant} ${msg.isError ? styles.bubbleError : ''}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`${styles.msg} ${styles.msgAssistant}`}>
                <span className={`material-symbols-outlined ${styles.msgIcon}`}>smart_toy</span>
                <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                  <span className={styles.typing}>
                    <span /><span /><span />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputRow} onSubmit={handleSend}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat_placeholder')}
              disabled={loading}
              maxLength={500}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || loading}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      )}

      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={t('chat_open')}
      >
        <span className="material-symbols-outlined">
          {open ? 'close' : 'smart_toy'}
        </span>
        {!open && messages.length > 0 && (
          <span className={styles.fabDot} />
        )}
      </button>
    </div>
  )
}
