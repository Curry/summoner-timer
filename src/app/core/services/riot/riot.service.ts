import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllData, AllPlayer, Player } from "../../models";
import { forkJoin, from, Observable, Observer, of, timer } from "rxjs";
import {
  combineAll,
  distinctUntilChanged,
  map,
  mergeMap,
  shareReplay,
} from "rxjs/operators";
import * as test from "./testdata.json";

@Injectable({
  providedIn: "root",
})
export class RiotService {
  private version = "10.25.1";
  private dataDragonUrl = "https://ddragon.leagueoflegends.com";
  private assets$: Observable<Player[]>;

  constructor(private http: HttpClient) {}

  public getAssets = (players: AllPlayer[]) => {
    if (!this.assets$) {
      this.assets$ = from(players).pipe(
        map((player) =>
          forkJoin([
            this.getChampionIcon(player.rawChampionName),
            this.getSummonerIcon(
              player.summonerSpells.summonerSpellOne.rawDescription
            ),
            this.getSummonerIcon(
              player.summonerSpells.summonerSpellTwo.rawDescription
            ),
          ]).pipe(
            map(
              ([champIcon, summOneIcon, summTwoIcon]) =>
                new Player(player, champIcon, summOneIcon, summTwoIcon)
            )
          )
        ),
        combineAll(),
        shareReplay(1)
      );
    }
    return this.assets$;
  };

  public test = () =>
    timer(0, 1000).pipe(
      mergeMap(() => this.getEnemyPlayers()),
      distinctUntilChanged(
        (a, b) => a.map((val) => val.level) !== b.map((val) => val.level)
      ),
      mergeMap((players) =>
        this.getAssets(players).pipe(
          mergeMap((val) =>
            from(val).pipe(
              map((player) => {
                const test = val.findIndex(
                  (existingPlayer) =>
                    existingPlayer.summonerName === player.summonerName
                );
                if (val[test].level !== player.level) {
                  val[test].level = player.level;
                  val[test].updateSummonerCds();
                }
                return of(val[test]);
              }),
              combineAll()
            )
          )
        )
      )
    );

  public getEnemyPlayers = (): Observable<AllPlayer[]> =>
    of((test as any).default as AllData).pipe(
      map((allData) =>
        allData.allPlayers.filter(
          (player) =>
            player.team !=
            allData.allPlayers.find(
              (player) =>
                player.summonerName == allData.activePlayer.summonerName
            ).team
        )
      )
    );

  private getChampionIcon = (
    rawName: string
  ): Observable<string | ArrayBuffer> =>
    this.http
      .get(
        `${this.dataDragonUrl}/cdn/${this.version}/img/champion/${
          /_([^_]+)$/.exec(rawName)[1]
        }.png`,
        {
          responseType: "blob",
        }
      )
      .pipe(mergeMap(this.parseImage));

  private getSummonerIcon = (
    rawName: string
  ): Observable<string | ArrayBuffer> =>
    this.http
      .get(
        `${this.dataDragonUrl}/cdn/${this.version}/img/spell/${
          /_(Summoner(?!Spell).*?)_/.exec(rawName)[1]
        }.png`,
        {
          responseType: "blob",
        }
      )
      .pipe(mergeMap(this.parseImage));

  private parseImage = (blob: Blob) =>
    new Observable((observer: Observer<string | ArrayBuffer>) => {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          observer.next(reader.result);
          observer.complete();
        },
        false
      );
      if (blob) {
        reader.readAsDataURL(blob);
      }
    });
}
