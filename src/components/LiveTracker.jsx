// LiveTracker.jsx — The main sideline tracking view.
//
// Shows both teams as scrollable player lists with live point totals.
// Tapping a player opens the StatModal to log their stats.
//
// Props:
//   game           — the current game object (from App state)
//   onUpdateStat   — function(playerId, stat, delta) called when a stat changes
//   onEndGame      — called when the user taps "End game"

import { useState, useEffect, useRef } from 'react'
import StatModal from './StatModal'
import { STAT_COLORS } from '../data/statColors'

// How long the score-pulse animation runs for — must match the CSS
// .score-pts.score-bump animation-duration in App.css.
const SCORE_BUMP_MS = 400

// How long the floating +N indicator stays visible — must match the CSS
// .score-float animation-duration in App.css.
const SCORE_FLOAT_MS = 700

export default function LiveTracker({ game, onUpdateStat, onEndGame }) {
  // Which player's modal is open. null = no modal showing.
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)

  // Split the player list into two teams
  const teamAPlayers = game.players.filter(p => p.team === 'A')
  const teamBPlayers = game.players.filter(p => p.team === 'B')

  // Calculate live scores by summing up each team's points
  const scoreA = teamAPlayers.reduce((sum, p) => sum + p.stats.pts, 0)
  const scoreB = teamBPlayers.reduce((sum, p) => sum + p.stats.pts, 0)

  // Briefly flash a "bump" class on whichever score just changed, giving
  // tactile feedback when a point is scored.
  const [bump, setBump] = useState(null) // 'A' | 'B' | null

  // The floating "+N" indicator that pops up next to a score when it changes.
  // 'key' forces React to remount the element so the animation replays on
  // every change, even repeated +1s in a row.
  const [floatStat, setFloatStat] = useState(null) // { side, amount, key } | null

  const prevScores = useRef({ A: scoreA, B: scoreB })

  useEffect(() => {
    const prev = prevScores.current
    const deltaA = scoreA - prev.A
    const deltaB = scoreB - prev.B

    if (deltaA !== 0) {
      setBump('A')
      setFloatStat({ side: 'A', amount: deltaA, key: Date.now() })
    } else if (deltaB !== 0) {
      setBump('B')
      setFloatStat({ side: 'B', amount: deltaB, key: Date.now() })
    }
    prevScores.current = { A: scoreA, B: scoreB }

    if (deltaA !== 0 || deltaB !== 0) {
      const bumpTimer = setTimeout(() => setBump(null), SCORE_BUMP_MS)
      const floatTimer = setTimeout(() => setFloatStat(null), SCORE_FLOAT_MS)
      return () => { clearTimeout(bumpTimer); clearTimeout(floatTimer) }
    }
  }, [scoreA, scoreB])

  // Who's currently ahead — used to add a subtle leading-side glow.
  // null when tied, so neither side is highlighted.
  const leader = scoreA === scoreB ? null : scoreA > scoreB ? 'A' : 'B'

  // Find the full player object for whoever is selected
  const selectedPlayer = game.players.find(p => p.id === selectedPlayerId) ?? null

  return (
    <div className="tracker-screen">

      {/* ── SCOREBOARD ── */}
      <div className="scoreboard">
        <div className={`score-side${leader === 'A' ? ' leading' : ''}`}>
          <div className="score-team-name">{game.teamA}</div>
          <div className={`score-pts score-a${bump === 'A' ? ' score-bump' : ''}`}>
            {scoreA}
            {floatStat?.side === 'A' && (
              <span key={floatStat.key} className="score-float score-a">
                {floatStat.amount > 0 ? `+${floatStat.amount}` : floatStat.amount}
              </span>
            )}
          </div>
        </div>
        <div className="score-sep">–</div>
        <div className={`score-side${leader === 'B' ? ' leading' : ''}`}>
          <div className="score-team-name">{game.teamB}</div>
          <div className={`score-pts score-b${bump === 'B' ? ' score-bump' : ''}`}>
            {scoreB}
            {floatStat?.side === 'B' && (
              <span key={floatStat.key} className="score-float score-b">
                {floatStat.amount > 0 ? `+${floatStat.amount}` : floatStat.amount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── PLAYER LISTS ── */}
      <div className="player-lists">

        <div className="team-section-label label-a">{game.teamA}</div>
        <div className="player-list-group" style={{ '--accent': 'var(--color-amber)' }}>
          {teamAPlayers.map(player => (
            <PlayerRow
              key={player.id}
              player={player}
              onClick={() => setSelectedPlayerId(player.id)}
            />
          ))}
        </div>

        <div className="team-section-label label-b" style={{ marginTop: 14 }}>{game.teamB}</div>
        <div className="player-list-group" style={{ '--accent': 'var(--color-green)' }}>
          {teamBPlayers.map(player => (
            <PlayerRow
              key={player.id}
              player={player}
              onClick={() => setSelectedPlayerId(player.id)}
            />
          ))}
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div className="tracker-footer">
        <button className="end-game-btn" onClick={onEndGame}>
          End game
        </button>
      </div>

      {/* ── STAT MODAL ── */}
      {/* Only rendered when a player is selected */}
      {selectedPlayer && (
        <StatModal
          player={selectedPlayer}
          teamName={selectedPlayer.team === 'A' ? game.teamA : game.teamB}
          onUpdate={(stat, delta) => onUpdateStat(selectedPlayer.id, stat, delta)}
          onClose={() => setSelectedPlayerId(null)}
        />
      )}

    </div>
  )
}

// ── PlayerRow ──
// A single row in the player list.
// Defined here (not in its own file) because it's small and only used here.
function PlayerRow({ player, onClick }) {
  const { pts, ast, reb } = player.stats
  return (
    <button className="player-row" onClick={onClick}>
      <span className="player-row-name">{player.name}</span>
      <span className="stat-chip" style={{ '--accent': STAT_COLORS.pts }}>{pts} PTS</span>
      <span className="stat-chip" style={{ '--accent': STAT_COLORS.ast }}>{ast} AST</span>
      <span className="stat-chip" style={{ '--accent': STAT_COLORS.reb }}>{reb} REB</span>
      <span className="row-chevron">›</span>
    </button>
  )
}
