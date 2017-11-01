import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'pokemon-app',
    template: require('./app.component.html'),
    styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        console.log('Test');
    }

}