import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
	apiUrl: string = 'http://openback.local.com/api';
	urlPhoto: string = 'http://openback.local.com/';
	urlPhotoLogin: string = 'http://openmedical.local.com/assets/img/login.jpg';
	urlDomain: string = 'http://openmedical.local.com/';
	whiteimg: string = '';
	getUrl: string = '';
	isLogued: boolean = false;
	role: string = '';
}
