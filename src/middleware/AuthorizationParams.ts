import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../helpers/ApiError'

export default (req: Request, res: Response, next: NextFunction) => {
  const jwt = req.cookies.jwt
  const accessToken = req.headers?.authorization || req.headers?.Authorization

  if(!accessToken) next(new UnauthorizedError('Access token is missing'))
  if(!jwt) next(new UnauthorizedError('Refresh token is missing'))
  next();
}