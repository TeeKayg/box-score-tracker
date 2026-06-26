// statColors.js — Single source of truth for stat category colors.
//
// Used by StatModal (totals/buttons), LiveTracker (player row chips),
// BoxScore (table headers) and SeasonDashboard (leaderboards) so every
// screen colors PTS/AST/REB/etc. consistently.

export const STAT_COLORS = {
  pts: '#F5A623',
  ast: '#4ADE80',
  reb: '#60A5FA',
  stl: '#A78BFA',
  blk: '#34D399',
  to:  '#F87171',
  fl:  '#FB923C',
}

export const STAT_LABELS = {
  pts: 'PTS',
  ast: 'AST',
  reb: 'REB',
  stl: 'STL',
  blk: 'BLK',
  to:  'TO',
  fl:  'FL',
}

export const STAT_KEYS = Object.keys(STAT_COLORS)
