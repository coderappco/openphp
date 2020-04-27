import { Component, OnInit } from '@angular/core';

@Component({
  	selector: 'app-footer',
  	templateUrl: './footer.component.html',
  	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	role: string = '';

  	constructor() { }

	ngOnInit() {
		let us = JSON.parse(localStorage.getItem('currentUser'));
		this.role = us != null ? us.role : '';
	}

}
