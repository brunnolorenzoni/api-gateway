import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../helpers/ApiError'
import axios from 'axios'

const check = (accessToken: string, jwt: string) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/api/v1/auth/verify', {
      withCredentials: true,
      headers: {
        Cookie: `jwt=${jwt}`,
        Authorization: accessToken
      }
    }).then(response => {
      resolve(true);
    })
    .catch(function (error) {
      reject(error);
    });
  })
}


export default (req: Request, res: Response, next: NextFunction) => {
  const jwt = req.cookies.jwt
  const accessToken = req.headers?.authorization!.toString() || req.headers?.Authorization!.toString()

  if(!accessToken) next(new UnauthorizedError('Access token is missing'))
  if(!jwt) next(new UnauthorizedError('Refresh token is missing'))

  check(accessToken, jwt).then(() => {
    next();
  }).catch((error) => {
    next(new UnauthorizedError(error))
  })
}