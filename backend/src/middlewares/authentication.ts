import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IPayload } from '../interfaces/types/IPayload';
import { HttpStatus } from '../enums/HTTPstatus.enum';
import { createResponse } from '../utilities/createResponse.utils';

const authenticateJWT = (requiredRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(HttpStatus.UNAUTHORIZED, 'Invalid token format')
        );
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(HttpStatus.UNAUTHORIZED, 'Access token is missing')
        );
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
          createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "JWT secret not configured")
        );
      }

      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
              message: "Token expired",
              code: "TOKEN_EXPIRED"
            });
          }
          return res.status(401).json({ message: "Invalid token" });
        }

        if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
          req.user = decoded as IPayload;
          req.userId = decoded.id as string;

          if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
          }

          next();
        } else {
          return res.status(401).json({ message: "Invalid token payload" });
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({ message: "Authentication error", error });
    }
  };
};

export default authenticateJWT;
