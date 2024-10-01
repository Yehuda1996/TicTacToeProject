import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Get the token from the cookies
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Access token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

export default authMiddleware;
