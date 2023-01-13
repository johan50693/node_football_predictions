
import { request, response } from 'express'

export const createUser = (req=request, res= response) => {

  res.json({
    code:200,
    endpoint: 'api/auth/create',
    message: 'success'
  });

}

export const login = (req=request, res= response) => {

  res.json({
    code:200,
    endpoint: 'api/auth/login',
    message: 'success'
  });

}

export const refresh = (req=request, res= response) => {

  res.json({
    code:200,
    endpoint: 'api/auth/refresh',
    message: 'create success'
  });
  
}