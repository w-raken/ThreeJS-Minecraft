import {Routes} from '@angular/router';
import {QuickStartComponent} from './quick-start/quick-start.component';
import {ContributorsComponent} from './contributors/contributors.component';

export const routes: Routes = [
    {
        path: 'quick-start',
        component: QuickStartComponent
    },
    {
        path: 'contributors',
        component: ContributorsComponent
    },
    {
        path: '**',
        component: QuickStartComponent
    }
];