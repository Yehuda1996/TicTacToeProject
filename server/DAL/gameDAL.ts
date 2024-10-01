import { Game } from '../models/games.js';
import jsonfile from 'jsonfile';

const file = './data/usersDB.json';

export const getGames = async (): Promise<Game[]> => {
  return jsonfile.readFile(file);
};

export const saveGames = async (games: Game[]): Promise<void> => {
  await jsonfile.writeFile(file, games, { spaces: 2 });
};