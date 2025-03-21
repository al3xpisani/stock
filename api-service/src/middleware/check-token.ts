import { User, getAuth } from 'firebase/auth';
import { app } from '../config/firebase-config';
import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';
import { appAdmin } from '../config/firebase-config';
import { AuthResponse } from '../types';

export const checkValidToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAuthenticated: AuthResponse = {
    isAuthenticated: false,
    accessToken: 'Invalid token provided by client'
  };
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send('Authorization header is missing');
  }
  const token = authHeader.replace('Bearer', '').trim();
  const auth = getAuth(app);
  const currentUser: User | null = auth.currentUser;

  appAdmin
    .auth()
    .verifyIdToken(String(token))
    .then((googleDecodedToken) => {
      if (currentUser) {
        const clientProvidedToken = currentUser;
        if (googleDecodedToken.uid === clientProvidedToken.uid) {
          next();
        } else {
          return res.json({ isAuthenticated });
        }
      } else {
        return res.json({ isAuthenticated });
      }
    })
    .catch((error) => {
      console.error('invalid token provided by client ' + error);
      return res.json({ isAuthenticated });
    });
};
