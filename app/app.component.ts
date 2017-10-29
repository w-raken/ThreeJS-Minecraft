import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'pokemon-app',
    template: `<h1>Hello, Angular 4 !</h1>`,
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        console.log('Test');
    }

}