import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'minecraft',
    templateUrl: require('./home.component.html'),
    styleUrls: [require('./home.component.scss')]
})
export class HomeComponent implements OnInit {

    ngOnInit() {
        console.log('in HomeComponent');
    }
}