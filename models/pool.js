import { connection } from "../db/config.js"


export const pollGetById = async (id) => {
  try {
    
    const [ result ] = await connection.execute("SELECT * FROM poll p WHERE p.id=?",[id])
    return result
  } catch (error) {
    
  }
}