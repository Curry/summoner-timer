export interface Keystone {
  displayName: string;
  id: number;
  rawDescription: string;
  rawDisplayName: string;
}

export interface PrimaryRuneTree {
  displayName: string;
  id: number;
  rawDescription: string;
  rawDisplayName: string;
}

export interface SecondaryRuneTree {
  displayName: string;
  id: number;
  rawDescription: string;
  rawDisplayName: string;
}

export interface Runes {
  keystone: Keystone;
  primaryRuneTree: PrimaryRuneTree;
  secondaryRuneTree: SecondaryRuneTree;
}

export interface Scores {
  assists: number;
  creepScore: number;
  deaths: number;
  kills: number;
  wardScore: number;
}

export interface SummonerSpell {
  displayName: string;
  rawDescription: string;
  rawDisplayName: string;
}

export interface SummonerSpells {
  summonerSpellOne: SummonerSpell;
  summonerSpellTwo: SummonerSpell;
}

export interface Player {
  championName: string;
  isBot: boolean;
  isDead: boolean;
  items: any[];
  level: number;
  position: string;
  rawChampionName: string;
  rawSkinName: string;
  respawnTimer: number;
  runes: Runes;
  scores: Scores;
  skinID: number;
  skinName: string;
  summonerName: string;
  summonerSpells: SummonerSpells;
  team: string;
}
