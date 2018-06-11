// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, Router } from '@angular/router';

// Components
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {GameComponent} from './game/game.component';

// Routing
const appRoutes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'game', component: GameComponent},
    { path: '**', redirectTo: 'home'}
]

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        GameComponent
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}