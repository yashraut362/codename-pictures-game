export type Team = "Red" | "Blue" | "Bystander" | "Assassin";

export interface Card {
  id: number;
  image: string;
  revealed: boolean;
  cardType: Team;
}

export interface GameState {
  board: Card[];
  turn: "Red" | "Blue";
  winner: "Red" | "Blue" | null;
  currentClue: { clue: string; count: number } | null;
  players:any;
}
