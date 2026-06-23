// Home.jsx — The landing screen.
//
// Simple: a title, a "New game" button, and a link to the season dashboard.
// Props passed in from App.jsx:
//   onNewGame    — called when the user wants to start a game
//   onViewSeason — called when the user wants to see season stats
//   gameCount    — how many games have been played (shown as a badge)

export default function Home({ onNewGame, onViewSeason, gameCount }) {
  return (
    <div className="home-screen">
      <div className="home-logo">🏀</div>
      <h1 className="home-title">Box Score Tracker</h1>
      <p className="home-sub">Track stats. Build the season.</p>

      <div className="home-actions">
        <button className="primary-btn" onClick={onNewGame}>
          New game
        </button>

        <button className="secondary-btn" onClick={onViewSeason}>
          Season dashboard
          {/* Only show the game count badge if there are games */}
          {gameCount > 0 && (
            <span className="game-count-badge">{gameCount} games</span>
          )}
        </button>
      </div>
    </div>
  )
}
