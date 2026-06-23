// SeasonDashboard.jsx — Aggregates stats across all saved games.
//
// Builds leaderboards by crunching through the game history and computing
// per-game averages for each player.
//
// Props:
//   games  — array of all completed game objects (from localStorage)
//   onBack — go back to the home screen

export default function SeasonDashboard({ games, onBack }) {
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
    { stat: 'pts', label: 'Scoring',  unit: 'PPG', color: '#F5A623' },
    { stat: 'ast', label: 'Assists',  unit: 'APG', color: '#4ADE80' },
    { stat: 'reb', label: 'Rebounds', unit: 'RPG', color: '#60A5FA' },
    { stat: 'stl', label: 'Steals',   unit: 'SPG', color: '#A78BFA' },
    { stat: 'blk', label: 'Blocks',   unit: 'BPG', color: '#34D399' },
  ]

  return (
    <div className="season-screen">

      <div className="season-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Season 2026</h1>
      </div>

      {/* Summary cards */}
      <div className="season-meta-row">
        <div className="meta-card">
          <div className="meta-value score-a">{games.length}</div>
          <div className="meta-label">Games</div>
        </div>
        <div className="meta-card">
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
              <span className="history-date">
                {new Date(game.startedAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short'
                })}
              </span>
              <span className="history-result">
                {game.teamA} <strong>{scoreA}</strong> – <strong>{scoreB}</strong> {game.teamB}
              </span>
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
    <div className="leaderboard-section">
      <div className="lb-heading" style={{ color }}>{title}</div>
      {leaders.map((player, index) => (
        <div key={player.name} className="lb-row">
          <span
            className="lb-rank"
            style={{ color: index === 0 ? color : '#374151' }}
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
      ))}
    </div>
  )
}
