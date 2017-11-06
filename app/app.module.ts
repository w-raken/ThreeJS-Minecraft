import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import {RouterModule} from '@angular/router';
import {routes} from './app.route';
import {QuickStartComponent} from './quick-start/quick-start.component';
import {ContributorsComponent} from './contributors/contributors.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        MenuComponent,
        QuickStartComponent,
        ContributorsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}