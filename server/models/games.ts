export interface Game {
  gameId: string;
  move: {
    player: string;
    position: [number, number];
  };
  status: string;
  result?: string;
}