import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as ApiPlayerModel from "../../models/api/player.model";
import { LocalPlayer } from "../../models/local/player.model";
import { forkJoin, from, Observable, Observer, of } from "rxjs";
import { combineAll, map, mergeMap, tap } from "rxjs/operators";
import * as test from "./testdata.json";

@Injectable({
  providedIn: "root",
})
export class RiotService {
  private version = "10.25.1";
  private localUrl = "https://127.0.0.1:2999/liveclientdata";
  private dataDragonUrl = "https://ddragon.leagueoflegends.com";

  constructor(private http: HttpClient) {}

  public getPlayers = (): Observable<LocalPlayer.Player[]> =>
    // this.http.get<ApiPlayerModel.Player[]>(`${this.localUrl}/playerlist`)
    of((test as any).default as ApiPlayerModel.Player[]).pipe(
      mergeMap((players) =>
        from(players).pipe(
          map((player) =>
            forkJoin([
              this.getChampionIcon(player.championName),
              this.getSummonerIcon(
                /_(Summoner[^S].*?)_/.exec(
                  player.summonerSpells.summonerSpellOne.rawDescription
                )[1]
              ),
              this.getSummonerIcon(
                /_(Summoner[^S].*?)_/.exec(
                  player.summonerSpells.summonerSpellTwo.rawDescription
                )[1]
              ),
            ]).pipe(map((val) => ({ player, val })))
          ),
          combineAll()
        )
      ),
      map((val) =>
        val.map(
          ({ player, val }) =>
            ({
              championName: player.championName,
              championIcon: val[0],
              level: player.level,
              summonerName: player.summonerName,
              team: player.team,
              summonerOne: {
                image: val[1],
                name: player.summonerSpells.summonerSpellTwo.displayName,
              },
              summonerTwo: {
                image: val[2],
                name: player.summonerSpells.summonerSpellTwo.displayName,
              },
            } as LocalPlayer.Player)
        )
      )
    );

  public getActivePlayer = (): Observable<string> =>
    this.http.get<string>(`${this.localUrl}/activeplayername`);

  public getChampionIcon = (champName: string): Observable<any> =>
    this.http
      .get(
        `${this.dataDragonUrl}/cdn/${this.version}/img/champion/${champName}.png`,
        {
          responseType: "blob",
        }
      )
      .pipe(mergeMap(this.parseImage));

  public getSummonerIcon = (
    summonerSpell: string
  ): Observable<string | ArrayBuffer> =>
    this.http
      .get(
        `${this.dataDragonUrl}/cdn/${this.version}/img/spell/${summonerSpell}.png`,
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
