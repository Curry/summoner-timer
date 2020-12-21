import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllData, AllPlayer, Player } from "../../models";
import {
  combineLatest,
  forkJoin,
  from,
  merge,
  Observable,
  Observer,
  of,
  timer,
} from "rxjs";
import {
  catchError,
  combineAll,
  concatAll,
  distinctUntilChanged,
  exhaust,
  exhaustMap,
  filter,
  map,
  mergeAll,
  mergeMap,
  pluck,
  scan,
  shareReplay,
  skipWhile,
  switchMap,
  tap,
  toArray,
} from "rxjs/operators";
import * as test1 from "./testdata.json";
import * as test2 from "./testdata2.json";
import * as test3 from "./testdata3.json";

export type Image = string | ArrayBuffer;

@Injectable({
  providedIn: "root",
})
export class RiotService {
  private version = "10.25.1";
  private dataDragonUrl = "https://ddragon.leagueoflegends.com";
  private localUrl = "https://127.0.0.1:2999/liveclientdata/allgamedata";
  private champAssets: {
    [name: string]: Observable<[Image, Image, Image]>;
  };
  private useMockData = true;
  private toggle = false;
  private activeTeam: string;

  constructor(private http: HttpClient) {
    this.champAssets = {};
  }

  public getInfo = (): Observable<Player[]> =>
    this.getEnemyPlayers().pipe(
      mergeMap((players) =>
        from(players).pipe(
          map((player) =>
            this.getChampAsset(player).pipe(
              map(
                ([champIcon, summOneIcon, summTwoIcon]) =>
                  new Player(player, champIcon, summOneIcon, summTwoIcon)
              )
            )
          ),
          combineAll()
        )
      )
    );

  private getApi = () => (this.useMockData ? this.testAPI() : this.liveAPI()).pipe(catchError(x => of(undefined as AllData)));

  private testAPI = () => {
    let toReturn: AllData = (test3 as any).default;
    if (!this.toggle) {
      toReturn = (test1 as any).default;
      this.toggle = !this.toggle;
    }
    return of(toReturn);
  };

  private liveAPI = () => this.http.get<AllData>(this.localUrl);

  private getEnemyPlayers = (): Observable<AllPlayer[]> =>
    timer(0, 1000).pipe(
      switchMap(() => this.getApi()),
      distinctUntilChanged(),
      skipWhile(val => val === undefined),
      tap(
        (allData) =>
          (this.activeTeam = allData.allPlayers.find(
            (player) => player.summonerName == allData.activePlayer.summonerName
          ).team)
      ),
      pluck("allPlayers"),
      map((players) =>
        players.filter((player) => player.team !== this.activeTeam)
      )
    );

  private getChampAsset = (
    player: AllPlayer
  ): Observable<[Image, Image, Image]> => {
    if (!this.champAssets[player.championName]) {
      this.champAssets[player.championName] = forkJoin([
        this.getChampionIcon(player.rawChampionName),
        this.getSummonerIcon(
          player.summonerSpells.summonerSpellOne.rawDescription
        ),
        this.getSummonerIcon(
          player.summonerSpells.summonerSpellTwo.rawDescription
        ),
      ]).pipe(shareReplay(1));
    }
    return this.champAssets[player.championName];
  };

  private getChampionIcon = (rawName: string): Observable<Image> =>
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

  private getSummonerIcon = (rawName: string): Observable<Image> =>
    this.http
      .get(
        `${this.dataDragonUrl}/cdn/${this.version}/img/spell/${
          /_((Summoner(?!Spell)[A-Z]{1}[a-z]*).*)_/.exec(rawName)[2]
        }.png`,
        {
          responseType: "blob",
        }
      )
      .pipe(mergeMap(this.parseImage));

  private parseImage = (blob: Blob) =>
    new Observable((observer: Observer<Image>) => {
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
