import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { UnauthorizedError } from '../helpers/ApiError'

export default async (req: Request, res: Response, next: NextFunction) => {

  const jwt = req.cookies.jwt
  const accessToken = req.headers.authorization!.toString() || req.headers.Authorization!.toString()

  try {
    await axios.get('http://localhost:3000/api/v1/auth/verify', {
      withCredentials: true,
      headers: {
        Cookie: `jwt=${jwt}`,
        Authorization: accessToken
      }
    })
    next() 
  } catch (err: any) {
    next(new UnauthorizedError(err.response.data.message))
  }
  
}