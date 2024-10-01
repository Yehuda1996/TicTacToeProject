import { Request, Response, NextFunction } from 'express';
import * as userService from '../service/userService.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/Users.js';
import dotenv from "dotenv"

dotenv.config();

const JWT_SECRET:string = process.env.JWT_SECRET || "default_secret";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user: User = await userService.createUser(username, password);
    res.json({ id: user.id, username: user.username });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await userService.authenticateUser(username, password);
    if (user) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, {
        httpOnly: true, // Prevent access from JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        maxAge: 3600000, // 1 hour in milliseconds
        sameSite: 'strict', // Strict cross-site cookie policy
      });
      res.json({ message: 'Invalid credentials' });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserGames =  async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
  try {
    const userId = req.params.id 
    const userGames = await userService.GetUserGamesById(userId);
    if (userGames) {
      res.json(userGames);
    } else {
      res.status(401).json({ message: 'Games user not found' });
    }
  } catch (error) {
    next(error);
  }
}