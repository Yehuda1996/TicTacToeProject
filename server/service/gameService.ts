import { User } from '../models/Users.js';
import { Game } from '../models/games.js';
import { getUsers, saveUsers } from '../DAL/usersDAL.js';
import bcrypt from 'bcrypt';
import {uuid} from 'uuidv4'
import { getGames } from '../DAL/gameDAL.js';


const GetCorrectGame = async (id: string) : Promise<boolean|null>=>{
    const users: User[] = await getUsers();
    const games: Game[] = await getGames();
    const userObject: User | undefined = users.find(u => u.id === id);
    if (!userObject) return null
      const allGamesUser = userObject.games
      if (!allGamesUser) return null
          const game: Game | undefined = games.find(u => u.gameId === allGamesUser[allGamesUser.length -1]);
            game?.move.position.length  
}
