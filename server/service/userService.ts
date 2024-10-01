import { User } from '../models/Users.js';
import { Game } from '../models/games.js';
import { getUsers, saveUsers } from '../DAL/usersDAL.js';
import bcrypt from 'bcrypt';
import {uuid} from 'uuidv4'
import { getGames } from '../DAL/gameDAL.js';

export const createUser = async (username: string, password: string): Promise<User> => {
  const users: User[] = await getUsers();
  let typePlayer: string = "X"
  users[users.length].player !== "X" ? typePlayer = "Y": typePlayer = "X" 
  const passwordHash: string = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: uuid(),
    player: typePlayer,
    username,
    passwordHash,
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
};

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  const users: User[] = await getUsers();
  const user: User | undefined = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    return user;
  }
  return null;
};


export const GetUserGamesById = async (id: string): Promise<Game[] | null>=>{
  const users: User[] = await getUsers();
  const games: Game[] = await getGames();
  const userObject: User | undefined = users.find(u => u.id === id);
  if (userObject) {
      let allGamesUser: Game[] = [];
      let allIdGamesUser: string[]| undefined = userObject.games;
      if (allIdGamesUser) {
          for (let i = 0; i < allIdGamesUser.length; i++) {
              const game: Game |undefined = games.find(g => g.gameId === allIdGamesUser[i]);
              if (game) {
                  allGamesUser.push(game);
                }
            }return allGamesUser;
        }return null
    }return null
}