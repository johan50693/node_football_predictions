import { connection } from "../db/config.js"


export const matchesGetById = async (id) => {
  try {
    const [ result ] = await connection.execute("SELECT * FROM matches m WHERE m.id=?",[id])
    return result  
  } catch (error) {
    
  }
  
}