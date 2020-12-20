export interface AllData {
  activePlayer: ActivePlayer;
  allPlayers: AllPlayer[];
  events: Events;
  gameData: GameData;
}

export interface ActivePlayer {
  abilities: Abilities;
  championStats: ChampionStats;
  currentGold: number;
  fullRunes: FullRunes;
  level: number;
  summonerName: string;
}

export interface Abilities {
  E: Attribute;
  Passive: Attribute;
  Q: Attribute;
  R: Attribute;
  W: Attribute;
}

export interface Attribute {
  abilityLevel?: number;
  displayName: string;
  id?: string;
  rawDescription: string;
  rawDisplayName: string;
}

export interface ChampionStats {
  abilityPower: number;
  armor: number;
  armorPenetrationFlat: number;
  armorPenetrationPercent: number;
  attackDamage: number;
  attackRange: number;
  attackSpeed: number;
  bonusArmorPenetrationPercent: number;
  bonusMagicPenetrationPercent: number;
  cooldownReduction: number;
  critChance: number;
  critDamage: number;
  currentHealth: number;
  healthRegenRate: number;
  lifeSteal: number;
  magicLethality: number;
  magicPenetrationFlat: number;
  magicPenetrationPercent: number;
  magicResist: number;
  maxHealth: number;
  moveSpeed: number;
  physicalLethality: number;
  resourceMax: number;
  resourceRegenRate: number;
  resourceType: string;
  resourceValue: number;
  spellVamp: number;
  tenacity: number;
}

export interface FullRunes {
  generalRunes: Keystone[];
  keystone: Keystone;
  primaryRuneTree: Keystone;
  secondaryRuneTree: Keystone;
  statRunes: StatRune[];
}

export interface Keystone {
  displayName: string;
  id: number;
  rawDescription: string;
  rawDisplayName: string;
}

export interface StatRune {
  id: number;
  rawDescription: string;
}

export interface AllPlayer {
  championName: string;
  isBot: boolean;
  isDead: boolean;
  items: Item[];
  level: number;
  position: Position;
  rawChampionName: string;
  respawnTimer: number;
  runes: Runes;
  scores: Scores;
  skinID: number;
  summonerName: string;
  summonerSpells: SummonerSpells;
  team: Team;
  rawSkinName?: string;
  skinName?: string;
}

export interface Item {
  canUse: boolean;
  consumable: boolean;
  count: number;
  displayName: string;
  itemID: number;
  price: number;
  rawDescription: string;
  rawDisplayName: string;
  slot: number;
}

export enum Position {
  None = "NONE",
}

export interface Runes {
  keystone: Keystone;
  primaryRuneTree: Keystone;
  secondaryRuneTree: Keystone;
}

export interface Scores {
  assists: number;
  creepScore: number;
  deaths: number;
  kills: number;
  wardScore: number;
}

export interface SummonerSpells {
  summonerSpellOne: Attribute;
  summonerSpellTwo: Attribute;
}

export enum Team {
  Chaos = "CHAOS",
  Order = "ORDER",
}

export interface Events {
  Events: any[];
}

export interface GameData {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}
