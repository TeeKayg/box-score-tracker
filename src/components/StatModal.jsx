// StatModal.jsx — The bottom-sheet modal that slides up when you tap a player.
//
// Shows the player's current stat totals and a grid of +1 buttons.
// Tap a stat total to remove 1. Tap a +1 button to add 1.
//
// Props:
//   player   — the player object (name, stats)
//   teamName — display name of their team
//   onUpdate(stat, delta) — called to change a stat (+1 or -1)
//   onClose  — called when the modal should close

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
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>

        <div className="modal-handle" />

        <div className="modal-header">
          <div>
            <div className="modal-team-label">{teamName}</div>
            <div className="modal-player-name">{player.name}</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Current stat totals — tap any number to subtract 1 */}
        <p className="modal-hint">Tap number to remove · tap button to add</p>
        <div className="stat-totals-row">
          {STATS.map(s => (
            // Each total cell is a button. Tapping it subtracts 1 from that stat.
            // disabled when the value is already 0 (can't go below zero)
            <button
              key={s.key}
              className="stat-total-cell"
              style={{ '--accent': s.color }}
              onClick={() => onUpdate(s.key, -1)}
              disabled={player.stats[s.key] === 0}
            >
              <div className="total-value">{player.stats[s.key]}</div>
              <div className="total-label">{s.label}</div>
            </button>
          ))}
        </div>

        {/* +1 buttons — one per stat */}
        <div className="stat-btn-grid">
          {STATS.map(s => (
            <button
              key={s.key}
              className="stat-increment-btn"
              style={{ '--accent': s.color }}
              onClick={() => onUpdate(s.key, 1)}
            >
              <span className="btn-plus">+1</span>
              <span className="btn-stat-label">{s.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
