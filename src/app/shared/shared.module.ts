import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SummonerSpellComponent } from "./components/";
import { WebviewDirective } from "./directives/";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [SummonerSpellComponent, WebviewDirective],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    WebviewDirective,
    FormsModule,
    SummonerSpellComponent
  ],
})
export class SharedModule {}
