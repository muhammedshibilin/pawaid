import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IPayload } from '../interfaces/IPayload';



const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
 
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access token missing' });
  }


  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }

    req.user = decoded as IPayload;
    next(); 
  });
};

export default authenticateJWT;
