import { matchesGetById, tournamentsGetById } from "../models/index.js"

export const canAssignMatches = async (tournament_id, matches_id) => {

  const tournament = await tournamentsGetById(tournament_id)
  const matches = await matchesGetById(matches_id)

  if (tournament.length > 0 && matches.length > 0) {
    return true
  }
  return false
}