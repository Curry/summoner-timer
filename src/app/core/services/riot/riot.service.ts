import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllPlayer, Player } from "../../models";
import { forkJoin, from, Observable, Observer, of, timer } from "rxjs";
import {
  catchError,
  combineAll,
  distinctUntilChanged,
  map,
  mergeMap,
  shareReplay,
  skipWhile,
  switchMap,
} from "rxjs/operators";

export type Image = string | ArrayBuffer;

@Injectable({
  providedIn: "root",
})
export class RiotService {
  private version$: Observable<string>;
  private dataDragonUrl = "https://ddragon.leagueoflegends.com";
  private localUrl = "https://127.0.0.1:2999/liveclientdata";
  private champAssets: {
    [name: string]: Observable<[Image, Image, Image]>;
  };

  constructor(private http: HttpClient) {
    this.champAssets = {};
  }

  public get version(): Observable<string> {
    if (!this.version$) {
      this.version$ = this.http
        .get<string[]>(`${this.dataDragonUrl}/api/versions.json`)
        .pipe(
          map((versions) => versions[0]),
          shareReplay(1)
        );
    }
    return this.version$;
  }

  public getInfo = (): Observable<Player[]> =>
    timer(0, 1000).pipe(
      switchMap(this.getEnemyPlayers),
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
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

  private getActivePlayer = (): Observable<string> =>
    this.http
      .get(`${this.localUrl}/activeplayername`, {
        headers: {
          rejectUnauthorized: "false",
          insecure: "true",
        },
        responseType: "text",
      })
      .pipe(catchError(() => of("")));

  private getPlayerList = (): Observable<AllPlayer[]> =>
    this.http.get<AllPlayer[]>(`${this.localUrl}/playerlist`, {
      headers: {
        rejectUnauthorized: "false",
        insecure: "true",
      },
    });

  private getEnemyPlayers = (): Observable<AllPlayer[]> =>
    this.getActivePlayer().pipe(
      skipWhile((x) => x === ""),
      mergeMap((name) =>
        this.getPlayerList().pipe(
          map((players) => {
            const activeTeam = players.find(
              (player) => player.summonerName == name
            ).team;
            return players.filter((player) => player.team !== activeTeam);
          })
        )
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
    this.version
      .pipe(
        mergeMap((version) =>
          this.http.get(
            `${this.dataDragonUrl}/cdn/${version}/img/champion/${
              /_([^_]+)$/.exec(rawName)[1]
            }.png`,
            {
              responseType: "blob",
            }
          )
        ),
        mergeMap(this.parseImage)
      )

      .pipe();

  private getSummonerIcon = (rawName: string): Observable<Image> =>
    this.version.pipe(
      mergeMap((version) =>
        this.http.get(
          `${this.dataDragonUrl}/cdn/${version}/img/spell/${
            /_((Summoner(?!Spell)[A-Z]{1}[a-z]*).*)_/.exec(rawName)[2]
          }.png`,
          {
            responseType: "blob",
          }
        )
      ),
      mergeMap(this.parseImage)
    );

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
