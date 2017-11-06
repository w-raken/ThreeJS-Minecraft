import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import {AppRoutingModule} from './routing.module';
import {QuickStartComponent} from './quick-start/quick-start.component';
import {ContributorsComponent} from './contributors/contributors.component';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule
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