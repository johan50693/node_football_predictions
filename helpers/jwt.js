import jwt from 'jsonwebtoken'

export const generarJWT = (uid,name) => {

  const data = {uid,name}
  const privateKey = process.env.PRIVATE_KEY

  return new Promise ((resolve,reject) => {
    jwt.sign(data,privateKey,{ expiresIn: '1h' }, (err,token) => {
      if(err){
        console.log(err)
        reject("No se ha podido generar el token")
      }
      resolve(token)
    })
  })
}
