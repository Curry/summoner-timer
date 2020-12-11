import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { interval, timer } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import {
  LocalPlayer,
  SummonerCooldowns,
} from "../core/models/local/player.model";
import { RiotService } from "../core/services";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private service: RiotService) {}
  public console = console;

  ngOnInit(): void {}

  test = this.service
    .getAllInfo()
    .pipe(tap((val) => console.log(val.map((ival) => ival.summonerOne.name))));

  potato = (sum: LocalPlayer.SummonerSpell): void => {
    if (sum.timerObservable) {
      sum.timerObservable.unsubscribe();
    }
    sum.timerObservable = timer(0, 10).pipe(
      takeUntil(timer(SummonerCooldowns[sum.name] * 1000))
    ).subscribe(val => sum.timer = val / SummonerCooldowns[sum.name], () => {}, () => {
      sum.timer = null;
    });
  };
}
