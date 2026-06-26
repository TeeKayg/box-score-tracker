// defaultPlayers.js — The pre-populated roster shown in game setup.
//
// These names appear by default so you don't have to type them every time.
// You can add one-off players during setup too.

export const DEFAULT_PLAYERS = [
  'Kadz',
  'Bilz',
  'Jibz',
  'TeeKay',
  'Tallman',
  'Mo Has',
  'Anwar',
  'Yusuf',
  'Hirey',
  'Tallman Jr',
]

// Returns a fresh stats object — all zeros.
// We use a function so every player gets their own independent copy.
// (If we used a single object, all players would share the same stats!)
export function emptyStats() {
  return { pts: 0, ast: 0, reb: 0, stl: 0, blk: 0, to: 0, fl: 0 }
}

// Creates a full player object ready to be used in a game.
// crypto.randomUUID() generates a unique ID like "a1b2-c3d4-..." — this
// lets us identify each player reliably even if two share the same name.
export function createPlayer(name, team) {
  return {
    id: crypto.randomUUID(),
    name,
    team,   // 'A' or 'B'
    stats: emptyStats()
  }
}
