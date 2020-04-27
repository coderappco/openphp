import { Component, HostListener, OnInit, OnDestroy} from '@angular/core';
import {trigger, animate, transition, style, query} from '@angular/animations';
//import { AuthenticationService } from './services/authentication.service';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import {Globals} from './globals';

@Component({
  	selector: 'app',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.css'],
  	animations: [
	    trigger('fadeAnimation', [
			transition('* => *', [
			    query(
				    ':enter',
				    [style({ opacity: 0 })],
				    { optional: true }
			    ),
			    query(
			        ':enter',
			        [style({ opacity: 0 }), animate('0.3s ease-in', style({ opacity: 1 }))],
			        { optional: true }
			    )
			])
		])
   	]
})
export class AppComponent {
  	title = 'Open Medical';

  	constructor(public globals: Globals, private _loadingBar: SlimLoadingBarService, private _router: Router) {
        this._router.events.subscribe((event: Event) => {
	      	this.navigationInterceptor(event);
	    });
    }

    ngOnInit() {
    	/*var img = document.createElement('img');
	    img.src = this.globals.urlDomain + 'assets/img/white.png';
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);
	   	var dataURL = canvas.toDataURL("image/png");
	    this.globals.whiteimg = dataURL;*/
	}

	@HostListener('window:unload', ['$event'])
	unloadHandler(event) {
		/*let us = JSON.parse(localStorage.getItem('currentUser'));
		if(us) {
			localStorage.removeItem('currentUser');
		}*/
	}

	@HostListener('window:beforeunload', ['$event'])
	beforeunloadHandler(event) {
	  	//event.preventDefault();
	}

	ngOnDestroy () {
  	}

    private navigationInterceptor(event: Event): void {
	    if (event instanceof NavigationStart) {
	      	this._loadingBar.start();
	    }
	    if (event instanceof NavigationEnd) {
	    	/*var img = document.createElement('img');
		    img.src = this.globals.urlDomain + 'assets/img/white.png';
		    var canvas = document.createElement("canvas");
		    canvas.width = img.width;
		    canvas.height = img.height;
		    var ctx = canvas.getContext("2d");
		    ctx.drawImage(img, 0, 0);
		   	var dataURL = canvas.toDataURL("image/png");
		    this.globals.whiteimg = dataURL;*/
	      	this._loadingBar.complete();
	    }
	    if (event instanceof NavigationCancel) {
	      	this._loadingBar.stop();
	    }
	    if (event instanceof NavigationError) {
	      	this._loadingBar.stop();
	    }
	}
}
