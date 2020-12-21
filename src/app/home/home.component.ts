import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../core/models";
import { RiotService } from "../core/services";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private service: RiotService) {}
  public allInfo$: Observable<Player[]>;
  public size = 200;

  ngOnInit(): void {
    this.allInfo$ = this.service.getInfo();
  }
}
