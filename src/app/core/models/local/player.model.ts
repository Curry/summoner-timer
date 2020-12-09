export namespace LocalPlayer {
  export interface SummonerSpell {
    name: string;
    image: string | ArrayBuffer;
  }
  export interface Player {
    championName: string;
    championIcon: string | ArrayBuffer;
    level: number;
    summonerName: string;
    summonerOne: SummonerSpell;
    summonerTwo: SummonerSpell;
    team: string;
  }
}

