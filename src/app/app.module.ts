import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { CardComponent } from "./components/card/card.component";
import { HeroComponent } from "./components/hero/hero.component";

@NgModule ({
    declarations: [
        AppComponent,
        CardComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HeroComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }