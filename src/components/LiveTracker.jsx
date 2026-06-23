// LiveTracker.jsx — The main sideline tracking view.
//
// Shows both teams as scrollable player lists with live point totals.
// Tapping a player opens the StatModal to log their stats.
//
// Props:
//   game           — the current game object (from App state)
//   onUpdateStat   — function(playerId, stat, delta) called when a stat changes
//   onEndGame      — called when the user taps "End game"

import { useState } from 'react'
import StatModal from './StatModal'

export default function LiveTracker({ game, onUpdateStat, onEndGame }) {
  // Which player's modal is open. null = no modal showing.
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)

  // Split the player list into two teams
  const teamAPlayers = game.players.filter(p => p.team === 'A')
  const teamBPlayers = game.players.filter(p => p.team === 'B')

  // Calculate live scores by summing up each team's points
  const scoreA = teamAPlayers.reduce((sum, p) => sum + p.stats.pts, 0)
  const scoreB = teamBPlayers.reduce((sum, p) => sum + p.stats.pts, 0)

  // Find the full player object for whoever is selected
  const selectedPlayer = game.players.find(p => p.id === selectedPlayerId) ?? null

  return (
    <div className="tracker-screen">

      {/* ── SCOREBOARD ── */}
      <div className="scoreboard">
        <div className="score-side">
          <div className="score-team-name">{game.teamA}</div>
          <div className="score-pts score-a">{scoreA}</div>
        </div>
        <div className="score-sep">–</div>
        <div className="score-side">
          <div className="score-team-name">{game.teamB}</div>
          <div className="score-pts score-b">{scoreB}</div>
        </div>
      </div>

      {/* ── PLAYER LISTS ── */}
      <div className="player-lists">

        <div className="team-section-label label-a">{game.teamA}</div>
        <div className="player-list-group">
          {teamAPlayers.map(player => (
            <PlayerRow
              key={player.id}
              player={player}
              onClick={() => setSelectedPlayerId(player.id)}
            />
          ))}
        </div>

        <div className="team-section-label label-b" style={{ marginTop: 14 }}>{game.teamB}</div>
        <div className="player-list-group">
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
      <span className="stat-chip">{pts} PTS</span>
      <span className="stat-chip">{ast} AST</span>
      <span className="stat-chip">{reb} REB</span>
      <span className="row-chevron">›</span>
    </button>
  )
}
