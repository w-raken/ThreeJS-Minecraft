import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'angular-app',
    templateUrl: require('./app.component.html'),
    styleUrls: [require('./app.component.scss')]
})
export class AppComponent implements OnInit {
	ngOnInit(): void {
		console.log('Test');
	}

}