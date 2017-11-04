import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'angular-login',
    templateUrl: require('./login.component.html'),
    styleUrls: [require('./login.component.scss')]
})
export class LoginComponent implements OnInit {
    ngOnInit(): void {
        console.log('Login');
    }

}