import { Component, Input, OnInit } from "@angular/core";
import { timer } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SummonerSpell } from "../../../core/models";

@Component({
  selector: "app-summoner-spell",
  templateUrl: "./summoner-spell.component.html",
  styleUrls: ["./summoner-spell.component.scss"],
})
export class SummonerSpellComponent implements OnInit {
  @Input() summonerSpell: SummonerSpell;
  @Input() size: number;
  private interval = 50;
  constructor() {}

  ngOnInit(): void {}

  convertToSeconds = (sum: SummonerSpell): number =>
    Math.round((sum.timer / 100.0) * sum.cooldown);

  startSummonerTimer = (sum: SummonerSpell): void => {
    if (sum.timerObservable) {
      sum.timerObservable.unsubscribe();
    }
    sum.timerObservable = timer(0, this.interval)
      .pipe(takeUntil(timer(sum.cooldown * 1000)))
      .subscribe(
        (val: number) => {
          sum.timer = 100 - ((val + 1) * (this.interval / 10.0)) / sum.cooldown;
        },
        () => {},
        () => {
          sum.timer = null;
        }
      );
  };
}
