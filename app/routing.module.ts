import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuickStartComponent} from './quick-start/quick-start.component';
import {ContributorsComponent} from './contributors/contributors.component';


const routes: Routes = [
    {path: '', redirectTo: '/quick-start', pathMatch: 'full'},
    {path: 'quick-start', component: QuickStartComponent},
    {path: 'contributors', component: ContributorsComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
