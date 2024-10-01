export interface User {
  id: string;
  player: string;
  username: string;
  passwordHash: string;
  games?: [];
}
