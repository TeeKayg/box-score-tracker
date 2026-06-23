// StatModal.jsx — The bottom-sheet modal that slides up when you tap a player.
//
// Shows the player's current stat totals and a grid of +1 buttons.
// Also has an "Undo" button that reverses the last action.
//
// Props:
//   player   — the player object (name, stats)
//   teamName — display name of their team
//   onUpdate(stat, delta) — called to change a stat (+1 or -1)
//   onClose  — called when the modal should close

import { useState } from 'react'

// The list of stats the modal tracks. Defined outside the component so it
// doesn't get re-created on every render (it never changes).
const STATS = [
  { key: 'pts', label: 'PTS', color: '#F5A623' },
  { key: 'ast', label: 'AST', color: '#4ADE80' },
  { key: 'reb', label: 'REB', color: '#60A5FA' },
  { key: 'stl', label: 'STL', color: '#A78BFA' },
  { key: 'blk', label: 'BLK', color: '#34D399' },
  { key: 'to',  label: 'TO',  color: '#F87171' },
  { key: 'fl',  label: 'FL',  color: '#FB923C' },
]

export default function StatModal({ player, teamName, onUpdate, onClose }) {
  // Track the last action so we can undo it.
  // Shape: { stat: 'pts', delta: 1 } — or null if nothing to undo.
  const [lastAction, setLastAction] = useState(null)

  function handleUpdate(stat, delta) {
    onUpdate(stat, delta)
    setLastAction({ stat, delta })
  }

  function handleUndo() {
    if (!lastAction) return
    // Reverse the last delta (e.g. if we added +1, apply -1)
    onUpdate(lastAction.stat, -lastAction.delta)
    setLastAction(null)
  }

  return (
    // The backdrop fills the whole screen. Clicking it closes the modal.
    <div className="modal-backdrop" onClick={onClose}>

      {/* The sheet itself. e.stopPropagation() prevents clicks inside the
          sheet from also triggering the backdrop's onClick. */}
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>

        {/* Drag handle — purely visual, indicates it's a sheet */}
        <div className="modal-handle" />

        {/* Header: player name + close button */}
        <div className="modal-header">
          <div>
            <div className="modal-team-label">{teamName}</div>
            <div className="modal-player-name">{player.name}</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Current stat totals — the row of numbers at the top of the sheet */}
        <div className="stat-totals-row">
          {STATS.map(s => (
            <div
              key={s.key}
              className="stat-total-cell"
              style={{ '--accent': s.color }}
            >
              <div className="total-value">{player.stats[s.key]}</div>
              <div className="total-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* +1 buttons — one per stat, plus an Undo */}
        <div className="stat-btn-grid">
          {STATS.map(s => (
            <button
              key={s.key}
              className="stat-increment-btn"
              style={{ '--accent': s.color }}
              onClick={() => handleUpdate(s.key, 1)}
            >
              <span className="btn-plus">+1</span>
              <span className="btn-stat-label">{s.label}</span>
            </button>
          ))}

          {/* Undo button — disabled if there's nothing to undo */}
          <button
            className="stat-increment-btn undo-btn"
            onClick={handleUndo}
            disabled={!lastAction}
          >
            <span className="btn-plus">−1</span>
            <span className="btn-stat-label">Undo</span>
          </button>
        </div>

      </div>
    </div>
  )
}
