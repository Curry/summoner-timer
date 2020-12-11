import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LocalPlayer, SummonerCooldowns } from "../../models/local/player.model";
import { forkJoin, from, interval, Observable, Observer, of, timer } from "rxjs";
import { combineAll, map, mergeMap, takeUntil, tap } from "rxjs/operators";
import * as test from "./testdata.json";
import { AllData } from "../../models/api/alldata.model";

@Injectable({
  providedIn: "root",
})
export class RiotService {
  private version = "10.25.1";
  private localUrl = "https://127.0.0.1:2999/liveclientdata";
  private dataDragonUrl = "https://ddragon.leagueoflegends.com";

  constructor(private http: HttpClient) {}

  public getAllInfo = (): Observable<LocalPlayer.Player[]> =>
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
      ),
      mergeMap((players) =>
        from(players).pipe(
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
                (images) =>
                  ({
                    championName: player.championName,
                    championIcon: images[0],
                    level: player.level,
                    summonerName: player.summonerName,
                    team: player.team,
                    summonerOne: {
                      image: images[1],
                      name: player.summonerSpells.summonerSpellOne.displayName,
                    },
                    summonerTwo: {
                      image: images[2],
                      name: player.summonerSpells.summonerSpellTwo.displayName,
                    },
                  } as LocalPlayer.Player)
              )
            )
          ),
          combineAll()
        )
      )
    );

  public getChampionIcon = (rawName: string): Observable<any> =>
    this.http
      .get(
        `${this.dataDragonUrl}/cdn/${this.version}/img/champion/${/_([^_]+)$/.exec(rawName)[1]}.png`,
        {
          responseType: "blob",
        }
      )
      .pipe(mergeMap(this.parseImage));

  public getSummonerIcon = (
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
