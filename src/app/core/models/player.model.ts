import { Subscription } from "rxjs";
import { AllPlayer, SummonerSpells } from ".";
import { Attribute } from "./game.model";

export class SummonerSpell {
  name: string;
  image: string | ArrayBuffer;
  cooldown: number;
  timerObservable?: Subscription;
  timer?: number;

  constructor(
    displayName: string,
    image: string | ArrayBuffer,
    cooldown: number
  ) {
    this.name = displayName;
    this.image = image;
    this.cooldown = cooldown;
  }
}
export class Player {
  championName: string;
  championIcon: string | ArrayBuffer;
  level: number;
  summonerName: string;
  summonerOne: SummonerSpell;
  summonerTwo: SummonerSpell;
  team: string;

  constructor(
    {
      championName,
      level,
      summonerName,
      team,
      summonerSpells: { summonerSpellOne: { displayName: summOneName }, summonerSpellTwo: { displayName: summTwoName } },
    }: AllPlayer,
    champIcon: string | ArrayBuffer,
    summOneIcon: string | ArrayBuffer,
    summTwoIcon: string | ArrayBuffer
  ) {
    this.championName = championName;
    this.championIcon = champIcon;
    this.level = level;
    this.summonerName = summonerName;
    this.team = team;
    this.summonerOne = new SummonerSpell(summOneName, summOneIcon, this.getSummonerCd(summOneName));
    this.summonerTwo = new SummonerSpell(summTwoName, summTwoIcon, this.getSummonerCd(summTwoName));
  }

  public updateSummonerCds = (): void => {
    this.summonerOne.cooldown = this.getSummonerCd(this.summonerOne.name);
    this.summonerTwo.cooldown = this.getSummonerCd(this.summonerTwo.name);
  };

  private getSummonerCd = (name: string): number => {
    let cooldown = 0;
    const summCooldowns = {
      Barrier: 180,
      Cleanse: 210,
      Ignite: 180,
      Exhaust: 210,
      Flash: 300,
      Ghost: 210,
      Heal: 240,
      Clarity: 240,
      Mark: 80
    };
    if (name === "Teleport") {
      cooldown = 430.588 - 10.588 * this.level;
    } else {
      cooldown = summCooldowns[name];
    }
    return cooldown;
  };
}
