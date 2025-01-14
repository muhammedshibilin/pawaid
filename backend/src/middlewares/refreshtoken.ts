import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IDecodedToken } from '../interfaces/types/IDecodeToken';
import dotenv from 'dotenv';
dotenv.config();

const refreshAccessToken = (req: Request, res: Response) => {
  console.log('haii refresh token call reached ')
  const refreshToken = req.cookies['refreshToken'];
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err: any, decoded:any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    const decodedToken = decoded as IDecodedToken;

    const newAccessToken = jwt.sign(
      { id: decodedToken?.id, email: decodedToken?.email, role: decodedToken?.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  });
};

export default refreshAccessToken;
