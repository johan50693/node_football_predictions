import { connection } from "../db/config.js"


export const tournamentsGetById = async (id) => {
  try {
    
    const [ result ] = await connection.execute("SELECT * FROM tournaments t WHERE t.id=?",[id])
    return result
  } catch (error) {
    
  }
}