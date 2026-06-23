// GameSetup.jsx — Configure the game before it starts.
//
// The user can:
//   - Name each team
//   - Tap players to assign them to Team A or Team B
//   - Add one-off players who aren't in the default roster
//   - Hit "Start game" to begin tracking
//
// Props:
//   onStart(gameConfig) — called with the full game object when ready
//   onBack             — goes back to the home screen

import { useState } from 'react'
import { DEFAULT_PLAYERS, createPlayer } from '../data/defaultPlayers'

export default function GameSetup({ onStart, onBack }) {
  const [teamAName, setTeamAName] = useState('Team A')
  const [teamBName, setTeamBName] = useState('Team B')

  // 'allPlayers' is the full list of names (default + any added ones)
  const [allPlayers, setAllPlayers] = useState(DEFAULT_PLAYERS)

  // 'assignments' maps each player name to 'A', 'B', or null (unassigned).
  // We pre-populate: first 5 on Team A, next 5 on Team B, rest unassigned.
  const [assignments, setAssignments] = useState(() => {
    const result = {}
    DEFAULT_PLAYERS.forEach((name, i) => {
      if (i < 5)       result[name] = 'A'
      else if (i < 10) result[name] = 'B'
      else             result[name] = null
    })
    return result
  })

  // Text field for adding a new player
  const [newPlayerName, setNewPlayerName] = useState('')

  // Tapping a player cycles their assignment: null → A → B → null
  function cycleAssignment(name) {
    setAssignments(prev => {
      const current = prev[name]
      const next = current === null ? 'A' : current === 'A' ? 'B' : null
      return { ...prev, [name]: next }
    })
  }

  // Add a brand-new player to the list
  function addPlayer() {
    const name = newPlayerName.trim()
    if (!name) return
    if (allPlayers.includes(name)) return  // prevent duplicates
    setAllPlayers(prev => [...prev, name])
    setAssignments(prev => ({ ...prev, [name]: null }))
    setNewPlayerName('')
  }

  function handleStart() {
    // Build the player objects for everyone who has been assigned to a team
    const players = allPlayers
      .filter(name => assignments[name] !== null)
      .map(name => createPlayer(name, assignments[name]))

    // Don't start if either team is empty
    const teamACount = players.filter(p => p.team === 'A').length
    const teamBCount = players.filter(p => p.team === 'B').length
    if (teamACount === 0 || teamBCount === 0) {
      alert('Each team needs at least one player.')
      return
    }

    onStart({
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      teamA: teamAName || 'Team A',
      teamB: teamBName || 'Team B',
      players
    })
  }

  // Split players into three groups for display
  const teamAPlayers  = allPlayers.filter(n => assignments[n] === 'A')
  const teamBPlayers  = allPlayers.filter(n => assignments[n] === 'B')
  const unassigned    = allPlayers.filter(n => assignments[n] === null)

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Game setup</h1>
      </div>

      {/* Team name inputs */}
      <div className="team-name-row">
        <input
          className="team-name-input input-a"
          value={teamAName}
          onChange={e => setTeamAName(e.target.value)}
          placeholder="Team A"
        />
        <span className="vs-divider">vs</span>
        <input
          className="team-name-input input-b"
          value={teamBName}
          onChange={e => setTeamBName(e.target.value)}
          placeholder="Team B"
        />
      </div>

      <p className="setup-hint">Tap a player to cycle: unassigned → {teamAName} → {teamBName}</p>

      {/* Team A players */}
      {teamAPlayers.length > 0 && (
        <div className="player-group">
          <div className="group-label label-a">{teamAName} ({teamAPlayers.length})</div>
          <div className="chip-row">
            {teamAPlayers.map(name => (
              <button key={name} className="player-chip chip-a" onClick={() => cycleAssignment(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Team B players */}
      {teamBPlayers.length > 0 && (
        <div className="player-group">
          <div className="group-label label-b">{teamBName} ({teamBPlayers.length})</div>
          <div className="chip-row">
            {teamBPlayers.map(name => (
              <button key={name} className="player-chip chip-b" onClick={() => cycleAssignment(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unassigned players */}
      {unassigned.length > 0 && (
        <div className="player-group">
          <div className="group-label label-none">Not playing ({unassigned.length})</div>
          <div className="chip-row">
            {unassigned.map(name => (
              <button key={name} className="player-chip chip-none" onClick={() => cycleAssignment(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add a new player */}
      <div className="add-player-row">
        <input
          className="add-player-input"
          value={newPlayerName}
          onChange={e => setNewPlayerName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPlayer()}
          placeholder="Add a player..."
        />
        <button className="add-player-btn" onClick={addPlayer}>Add</button>
      </div>

      <button className="start-btn" onClick={handleStart}>
        Start game →
      </button>
    </div>
  )
}
