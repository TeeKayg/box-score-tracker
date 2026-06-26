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
      <div className="home-logo">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" stroke="var(--color-amber)" strokeWidth="1.6" />
          <path d="M12 2.5v19M2.5 12h19" stroke="var(--color-amber)" strokeWidth="1.6" />
          <path d="M4.6 5.4c2 1.9 3.2 4.4 3.2 6.6s-1.2 4.7-3.2 6.6M19.4 5.4c-2 1.9-3.2 4.4-3.2 6.6s1.2 4.7 3.2 6.6" stroke="var(--color-amber)" strokeWidth="1.6" />
        </svg>
      </div>
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
