// App.jsx — The root component. The "brain" of the app.
//
// This file does two things:
//   1. Manages which screen is currently visible (the "view")
//   2. Holds the top-level game state and passes it down to child components
//
// Think of it like a TV remote: the view state decides which "channel" is on,
// and the game state is the data that all screens share.

import { useState, useEffect } from 'react'
import Home from './components/Home'
import GameSetup from './components/GameSetup'
import LiveTracker from './components/LiveTracker'
import BoxScore from './components/BoxScore'
import SeasonDashboard from './components/SeasonDashboard'

function App() {
  // --- VIEW STATE ---
  // Controls which screen is shown. Possible values:
  // 'home' | 'setup' | 'tracker' | 'boxscore' | 'season'
  const [view, setView] = useState('home')

  // --- CURRENT GAME STATE ---
  // Holds the active game while it's being played.
  // It's null when there's no game in progress.
  // Shape: { id, startedAt, teamA, teamB, players: [...] }
  const [currentGame, setCurrentGame] = useState(null)

  // --- SAVED GAMES STATE ---
  // All completed games, persisted to localStorage so they survive page refreshes.
  //
  // The function passed to useState is a "lazy initializer" — it only runs once
  // on the very first render. It tries to load saved games from localStorage.
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem('bbt-games')
      return saved ? JSON.parse(saved) : []
    } catch {
      // If localStorage is broken or the data is corrupt, start fresh
      return []
    }
  })

  // --- PERSIST TO LOCALSTORAGE ---
  // useEffect runs after every render where 'games' has changed.
  // This keeps localStorage in sync automatically whenever a game is saved.
  useEffect(() => {
    localStorage.setItem('bbt-games', JSON.stringify(games))
  }, [games])

  // --- HANDLERS ---
  // These functions are passed down to child components as props so they can
  // trigger state changes in this parent component.

  // Called by GameSetup when the user hits "Start game"
  function handleStartGame(gameConfig) {
    setCurrentGame(gameConfig)
    setView('tracker')
  }

  // Called by LiveTracker when the user taps "+1" on a stat.
  // We update the specific player's specific stat without touching anything else.
  function handleUpdateStat(playerId, stat, delta) {
    setCurrentGame(prev => ({
      ...prev,  // keep everything the same (teamA, teamB, id, etc.)
      players: prev.players.map(player => {
        if (player.id !== playerId) return player  // not this player, leave unchanged
        return {
          ...player,
          stats: {
            ...player.stats,
            // Math.max(0, ...) prevents stats from going below zero
            [stat]: Math.max(0, player.stats[stat] + delta)
          }
        }
      })
    }))
  }

  // Called by LiveTracker when the user taps "End game"
  function handleEndGame() {
    const completedGame = {
      ...currentGame,
      endedAt: new Date().toISOString()
    }
    // Add the finished game to the front of the history list
    setGames(prev => [completedGame, ...prev])
    setView('boxscore')
  }

  // --- RENDER ---
  // Only one screen is shown at a time, controlled by the 'view' state.
  // We use && (logical AND) to conditionally render each component —
  // if the left side is false, React renders nothing.
  return (
    <div className="app">
      {view === 'home' && (
        <Home
          onNewGame={() => setView('setup')}
          onViewSeason={() => setView('season')}
          gameCount={games.length}
        />
      )}

      {view === 'setup' && (
        <GameSetup
          onStart={handleStartGame}
          onBack={() => setView('home')}
        />
      )}

      {view === 'tracker' && currentGame && (
        <LiveTracker
          game={currentGame}
          onUpdateStat={handleUpdateStat}
          onEndGame={handleEndGame}
        />
      )}

      {view === 'boxscore' && games[0] && (
        <BoxScore
          game={games[0]}
          onNewGame={() => setView('setup')}
          onHome={() => setView('home')}
        />
      )}

      {view === 'season' && (
        <SeasonDashboard
          games={games}
          onBack={() => setView('home')}
        />
      )}
    </div>
  )
}

export default App
