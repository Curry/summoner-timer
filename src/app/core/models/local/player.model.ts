import { Observable, Subscription } from "rxjs";

export namespace LocalPlayer {
  export interface SummonerSpell {
    name: string;
    image: string | ArrayBuffer;
    timerObservable?: Subscription;
    timer?: number
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

export const SummonerCooldowns = {
  Barrier: 180,
  Cleanse: 210,
  Ignite: 5,
  Exhaust: 210,
  Flash: 300,
  Ghost: 210,
  Heal: 240,
  Clarity: 240,
  Mark: 80,
  Teleport: 0,
};
