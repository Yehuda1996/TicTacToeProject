import { Request, Response, NextFunction } from "express";
import * as userService from "../service/userService.js";
import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";
import dotenv from "dotenv";

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";
const games: { [gameId: string]: { board: string[][]; players: string[] } } =
  {};

export const StartSocket = async (  req: Request,  res: Response,  next: NextFunction): Promise<void> => {
  io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    socket.on("playerMove", (data) => {
      const { gameId, player, position } = data;

      const game = games[gameId];

      if (game) {
        const board = game.board;

        if (updateBoard(position, player, board)) {
          const winner = checkWinner(board);

          io.emit("moveMade", { gameId, player, position, board });

          if (winner) {
            io.emit("gameOver", { winner });
            console.log(`${winner} is the winner!`);
          }
        } else {
          console.log("Invalid move, the position is already taken.");
        }
      } else {
        console.log(`Game with ID ${gameId} not found.`);
      }
    });
  });
};

function createNewGame(gameId: string) {
  games[gameId] = {
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    players: [],
  };
}
