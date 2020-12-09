import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RiotService } from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private service: RiotService) {
    this.service.getPlayers().subscribe(console.log);
  }

  ngOnInit(): void { }

  test = this.service.getPlayers();


}
