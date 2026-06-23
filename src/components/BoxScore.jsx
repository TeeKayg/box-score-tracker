// BoxScore.jsx — The final game summary screen.
//
// Shows both teams' full stats in a traditional box score table.
// The "Export" button uses html2canvas to screenshot the score card
// and save it as a PNG the user can share.
//
// Props:
//   game      — the completed game object
//   onNewGame — start a new game
//   onHome    — go back to the home screen

import { useRef } from 'react'

// The stat columns to show in the table, in order
const STAT_COLS   = ['pts', 'ast', 'reb', 'stl', 'blk', 'to', 'fl']
const STAT_LABELS = ['PTS', 'AST', 'REB', 'STL', 'BLK', 'TO',  'FL']

export default function BoxScore({ game, onNewGame, onHome }) {
  // useRef gives us a direct reference to a DOM element.
  // We attach it to the score card div so html2canvas can screenshot it.
  const exportRef = useRef(null)

  const teamAPlayers = game.players.filter(p => p.team === 'A')
  const teamBPlayers = game.players.filter(p => p.team === 'B')
  const scoreA = teamAPlayers.reduce((sum, p) => sum + p.stats.pts, 0)
  const scoreB = teamBPlayers.reduce((sum, p) => sum + p.stats.pts, 0)

  // Export the score card as a PNG image
  async function handleExport() {
    // html2canvas is loaded dynamically (only when needed) to keep the
    // initial bundle smaller. 'await import(...)' is called "dynamic import".
    const { default: html2canvas } = await import('html2canvas')

    const canvas = await html2canvas(exportRef.current, {
      backgroundColor: '#090D18',
      scale: 2          // 2× resolution for sharp images on retina screens
    })

    // Create a temporary <a> tag, set its href to the image data,
    // then programmatically click it to trigger the download
    const link = document.createElement('a')
    link.download = `boxscore-${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="boxscore-screen">

      {/* Everything inside exportRef will be captured by html2canvas */}
      <div ref={exportRef} className="export-card">

        {/* Final score header */}
        <div className="bs-header">
          <div className="game-over-tag">FINAL</div>
          <div className="bs-final-score">
            <div className="bs-final-side">
              <div className="bs-final-team">{game.teamA}</div>
              <div className="bs-final-pts score-a">{scoreA}</div>
            </div>
            <div className="bs-sep">–</div>
            <div className="bs-final-side">
              <div className="bs-final-team">{game.teamB}</div>
              <div className="bs-final-pts score-b">{scoreB}</div>
            </div>
          </div>
          <div className="bs-date">
            {new Date(game.startedAt).toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
            })}
          </div>
        </div>

        {/* Box score tables — one per team */}
        <BoxScoreTable players={teamAPlayers} teamName={game.teamA} ptsClass="score-a" />
        <BoxScoreTable players={teamBPlayers} teamName={game.teamB} ptsClass="score-b" />

      </div>

      {/* Action buttons (not included in the export) */}
      <div className="bs-actions">
        <button className="export-btn" onClick={handleExport}>
          Export as image
        </button>
        <button className="new-game-btn" onClick={onNewGame}>
          New game
        </button>
        <button className="text-link-btn" onClick={onHome}>
          Back to home
        </button>
      </div>

    </div>
  )
}

// ── BoxScoreTable ──
// Renders a single team's stats as a table.
// 'ptsClass' is used to colour the points column (amber for A, green for B).
function BoxScoreTable({ players, teamName, ptsClass }) {
  return (
    <div className="bs-table-section">
      <div className="bs-team-heading">{teamName}</div>
      <table className="bs-table">
        <thead>
          <tr>
            <th className="bs-th bs-player-th">Player</th>
            {STAT_LABELS.map(label => (
              <th key={label} className="bs-th">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id} className="bs-row">
              <td className="bs-td bs-player-td">{player.name}</td>
              {STAT_COLS.map(stat => (
                <td
                  key={stat}
                  className={`bs-td bs-stat-td ${stat === 'pts' ? ptsClass : ''}`}
                >
                  {player.stats[stat]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
