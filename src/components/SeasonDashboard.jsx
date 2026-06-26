// SeasonDashboard.jsx — Aggregates stats across all saved games.
//
// Builds leaderboards by crunching through the game history and computing
// per-game averages for each player.
// Tapping a game in the history list drills into its full box score.
//
// Props:
//   games        — array of all completed game objects (from localStorage)
//   onBack       — go back to the home screen
//   onDeleteGame(gameId) — permanently remove a game from history

import { useState } from 'react'
import BoxScore from './BoxScore'
import { STAT_COLORS } from '../data/statColors'

// Medal colors for the top 3 spots on each leaderboard — falls back to the
// stat's own color for 4th place and below.
const MEDAL_COLORS = ['#FBBF24', '#CBD5E1', '#D97706'] // gold, silver, bronze

export default function SeasonDashboard({ games, onBack, onDeleteGame }) {
  // When set to a game object, we show that game's box score instead of the dashboard.
  // null = show the dashboard normally.
  const [selectedGame, setSelectedGame] = useState(null)

  // If a game is selected, render its box score.
  // onBack clears the selection and returns to the dashboard.
  if (selectedGame) {
    return (
      <BoxScore
        game={selectedGame}
        onBack={() => setSelectedGame(null)}
      />
    )
  }
  // Empty state — no games yet
  if (games.length === 0) {
    return (
      <div className="season-screen">
        <div className="season-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h1>Season 2026</h1>
        </div>
        <p className="empty-state">No games tracked yet. Play some ball!</p>
      </div>
    )
  }

  // ── Build per-player totals ──
  // We loop through every game, then every player in that game,
  // and accumulate their stats into a single object keyed by player name.
  //
  // The result looks like:
  //   { 'Marcus J.': { name, games: 5, pts: 80, ast: 15, ... }, ... }
  const playerTotals = {}

  games.forEach(game => {
    game.players.forEach(player => {
      // First time we've seen this player — initialise their entry
      if (!playerTotals[player.name]) {
        playerTotals[player.name] = {
          name: player.name,
          gamesPlayed: 0,
          pts: 0, ast: 0, reb: 0, stl: 0, blk: 0, to: 0, fl: 0
        }
      }

      const entry = playerTotals[player.name]
      entry.gamesPlayed++

      // Add this game's stats to their running totals
      // Object.keys() returns ['pts', 'ast', 'reb', ...] so we can loop over them
      Object.keys(player.stats).forEach(stat => {
        entry[stat] += player.stats[stat]
      })
    })
  })

  // Convert the object into an array so we can sort it
  const players = Object.values(playerTotals)

  // Returns top N players sorted by per-game average for a given stat
  function getLeaders(stat, n = 5) {
    return [...players]                           // copy so we don't mutate the original
      .sort((a, b) => {
        const avgA = a[stat] / a.gamesPlayed
        const avgB = b[stat] / b.gamesPlayed
        return avgB - avgA                         // descending (highest first)
      })
      .slice(0, n)
      .map(p => ({
        ...p,
        avg: (p[stat] / p.gamesPlayed).toFixed(1) // e.g. "18.4"
      }))
  }

  // The leaderboards we want to show, in order
  const BOARDS = [
    { stat: 'pts', label: 'Scoring',  unit: 'PPG', color: STAT_COLORS.pts },
    { stat: 'ast', label: 'Assists',  unit: 'APG', color: STAT_COLORS.ast },
    { stat: 'reb', label: 'Rebounds', unit: 'RPG', color: STAT_COLORS.reb },
    { stat: 'stl', label: 'Steals',   unit: 'SPG', color: STAT_COLORS.stl },
    { stat: 'blk', label: 'Blocks',   unit: 'BPG', color: STAT_COLORS.blk },
  ]

  return (
    <div className="season-screen">

      <div className="season-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Season 2026</h1>
      </div>

      {/* Summary cards */}
      <div className="season-meta-row">
        <div className="meta-card" style={{ '--accent': 'var(--color-amber)' }}>
          <div className="meta-value score-a">{games.length}</div>
          <div className="meta-label">Games</div>
        </div>
        <div className="meta-card" style={{ '--accent': 'var(--color-green)' }}>
          <div className="meta-value score-b">{players.length}</div>
          <div className="meta-label">Players</div>
        </div>
      </div>

      {/* Leaderboard for each stat */}
      {BOARDS.map(board => (
        <Leaderboard
          key={board.stat}
          title={board.label}
          unit={board.unit}
          color={board.color}
          leaders={getLeaders(board.stat)}
        />
      ))}

      {/* Game history list */}
      <div className="game-history">
        <div className="history-heading">Game history</div>
        {games.map(game => {
          const scoreA = game.players
            .filter(p => p.team === 'A')
            .reduce((s, p) => s + p.stats.pts, 0)
          const scoreB = game.players
            .filter(p => p.team === 'B')
            .reduce((s, p) => s + p.stats.pts, 0)
          return (
            <div key={game.id} className="history-row">
              {/* Tapping the main area opens that game's full box score */}
              <button
                className="history-row-main"
                onClick={() => setSelectedGame(game)}
              >
                <span className="history-date">
                  {new Date(game.startedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short'
                  })}
                </span>
                <span className="history-result">
                  {game.teamA} <strong>{scoreA}</strong> – <strong>{scoreB}</strong> {game.teamB}
                </span>
                <span className="history-chevron">›</span>
              </button>

              <button
                className="history-delete-btn"
                aria-label={`Delete ${game.teamA} vs ${game.teamB} game`}
                onClick={() => {
                  if (window.confirm(`Delete ${game.teamA} vs ${game.teamB}? This can't be undone.`)) {
                    onDeleteGame(game.id)
                  }
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10ZM10 11v6M14 11v6"
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

    </div>
  )
}

// ── Leaderboard ──
// Renders a ranked list of players for one stat category.
function Leaderboard({ title, unit, color, leaders }) {
  return (
    <div className="leaderboard-section" style={{ '--accent': color }}>
      <div className="lb-heading" style={{ color }}>{title}</div>
      {leaders.map((player, index) => {
        const medal = MEDAL_COLORS[index] // undefined for 4th place and below
        return (
          <div key={player.name} className="lb-row">
            <span
              className={`lb-rank${medal ? ' lb-rank-medal' : ''}`}
              style={{ color: medal ?? '#374151', '--medal': medal }}
            >
              {index + 1}
            </span>
            <span className="lb-name">{player.name}</span>
            <span
              className="lb-avg"
              style={{ color: index === 0 ? color : '#9CA3AF' }}
            >
              {player.avg}
            </span>
            <span className="lb-unit">{unit}</span>
          </div>
        )
      })}
    </div>
  )
}
