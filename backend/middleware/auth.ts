import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthRequest extends NextApiRequest {
  user?: IUser;
}

export function authMiddleware(handler: (req: AuthRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      // Note: In a real application, you would fetch the user from the database here
      // and attach it to the request object
      req.user = { _id: decoded.userId } as IUser;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
} 