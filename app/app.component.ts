import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'pokemon-app',
    templateUrl: './app/app.component.html',
    styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        console.log('Test');
    }

}