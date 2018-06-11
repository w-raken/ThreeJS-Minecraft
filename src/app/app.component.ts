import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'minecraft',
    templateUrl: require('./app.component.html'),
    styleUrls: [require('./app.component.scss')]
})
export class AppComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        console.log('redirecting ...');
        setTimeout((router: Router) => {
            console.log('redirect');
            this.router.navigate(['/home']);
        }, 2000);
    }
}