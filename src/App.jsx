import { useMemo, useState } from 'react'
import {
  CATEGORIES,
  CHALLENGES,
  itemsByCategory,
  getItem,
  pickDifferentChallenge,
  scoreLook,
  verdictFor,
} from './game/data.js'
import './styles.css'

const LAYER_ORDER = ['bottoms', 'tops', 'shoes', 'accessories']

function Avatar({ selectedIds, palette }) {
  const layers = LAYER_ORDER.flatMap((cat) => {
    const id = selectedIds[cat]
    if (!id) return []
    const item = getItem(id)
    if (!item) return []
    return [
      <span
        key={item.id}
        className={`layer layer--${cat}`}
        data-testid={`layer-${item.id}`}
        style={{ '--layer-color': item.color }}
        aria-label={item.name}
        title={item.name}
      >
        <span className="layer__glyph" aria-hidden="true">{item.emoji}</span>
        <span className="layer__label">{item.name}</span>
      </span>,
    ]
  })

  return (
    <div
      className={`avatar avatar--${palette}`}
      data-testid="avatar"
      role="img"
      aria-label="Outfit preview mannequin"
    >
      <div className="avatar__stage">
        <div className="avatar__shadow" aria-hidden="true" />
        <div className="avatar__body" aria-hidden="true">
          <div className="avatar__head">
            <div className="avatar__face">
              <div className="avatar__eye avatar__eye--l" />
              <div className="avatar__eye avatar__eye--r" />
              <div className="avatar__mouth" />
            </div>
          </div>
          <div className="avatar__torso" />
          <div className="avatar__legs" />
        </div>
        <div className="avatar__layers">{layers}</div>
        {layers.length === 0 && (
          <p className="avatar__hint">tap a piece to dress me ↓</p>
        )}
      </div>
    </div>
  )
}

function Closet({ selectedIds, onToggle }) {
  return (
    <div className="closet">
      {CATEGORIES.map((cat) => (
        <section className="closet__row" key={cat.id} aria-labelledby={`cat-${cat.id}`}>
          <h2 id={`cat-${cat.id}`} className="closet__heading">{cat.label}</h2>
          <div className="closet__scroll" role="list">
            {itemsByCategory(cat.id).map((item) => {
              const active = selectedIds[cat.id] === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="listitem"
                  className={`chip${active ? ' chip--active' : ''}`}
                  data-testid={`item-${cat.id}`}
                  data-item-id={item.id}
                  aria-pressed={active}
                  onClick={() => onToggle(cat.id, item.id)}
                  style={{ '--chip-color': item.color }}
                >
                  <span className="chip__glyph" aria-hidden="true">{item.emoji}</span>
                  <span className="chip__label">{item.name}</span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function ResultCard({ score, verdict, onClose }) {
  const iconic = score >= 80
  return (
    <div
      className={`result${iconic ? ' result--iconic' : ''}`}
      data-testid="result-card"
      data-iconic={iconic ? 'true' : 'false'}
      role="dialog"
      aria-live="polite"
      aria-label="Runway result"
    >
      <button
        type="button"
        className="result__close"
        onClick={onClose}
        aria-label="Close result"
      >
        ×
      </button>
      <div className="result__halo" aria-hidden="true" />
      <p className="result__eyebrow">Runway score</p>
      <p className="result__score" data-testid="score-value">{score}</p>
      <p className="result__verdict" data-testid="verdict">{verdict}</p>
      {iconic && <p className="result__badge">★ Iconic</p>}
    </div>
  )
}

export default function App() {
  const [challenge, setChallenge] = useState(CHALLENGES[0])
  // selectedIds: { tops?: id, bottoms?: id, shoes?: id, accessories?: id }
  const [selectedIds, setSelectedIds] = useState({})
  const [result, setResult] = useState(null)

  const selectedList = useMemo(
    () => CATEGORIES.map((c) => selectedIds[c.id]).filter(Boolean),
    [selectedIds],
  )

  const onToggle = (cat, id) => {
    setResult(null)
    setSelectedIds((prev) => {
      const next = { ...prev }
      if (next[cat] === id) delete next[cat]
      else next[cat] = id
      return next
    })
  }

  const onShuffle = () => {
    setResult(null)
    setChallenge((cur) => pickDifferentChallenge(cur.id))
  }

  const onReset = () => {
    setSelectedIds({})
    setResult(null)
  }

  const onRunway = () => {
    const score = scoreLook(selectedList, challenge)
    setResult({ score, verdict: verdictFor(score, challenge) })
  }

  return (
    <div className={`app app--${challenge.palette}`}>
      <div className="app__glow" aria-hidden="true" />
      <header className="app__header">
        <p className="app__eyebrow">a tiny dress-up game</p>
        <h1 className="app__title">OOTD</h1>
      </header>

      <section
        className="brief"
        aria-labelledby="brief-heading"
        data-testid="brief"
      >
        <p className="brief__label">Today's brief</p>
        <h2 id="brief-heading" className="brief__name">
          <span className="brief__emoji" aria-hidden="true">{challenge.emoji}</span>
          <span data-testid="challenge-name">{challenge.name}</span>
        </h2>
        <p className="brief__tagline">{challenge.tagline}</p>
        <ul className="brief__tags" aria-label="Style tags">
          {challenge.tags.map((tag) => (
            <li key={tag} className="brief__tag">#{tag}</li>
          ))}
        </ul>
      </section>

      <Avatar selectedIds={selectedIds} palette={challenge.palette} />

      <Closet selectedIds={selectedIds} onToggle={onToggle} />

      <footer className="actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onShuffle}
        >
          🔀 Shuffle Brief
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onRunway}
          disabled={selectedList.length === 0}
        >
          ✨ Runway
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onReset}
        >
          ↺ Reset
        </button>
      </footer>

      {result && (
        <ResultCard
          score={result.score}
          verdict={result.verdict}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  )
}
