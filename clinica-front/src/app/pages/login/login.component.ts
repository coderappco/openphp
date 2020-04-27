import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {Globals} from '../../globals';

import { AuthenticationService } from '../../services/authentication.service';

declare var $: any;
@Component({templateUrl: 'login.component.html'})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        public globals: Globals) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            usuario: ['', [Validators.required]],
            password: ['', Validators.required]
        });

        this.authenticationService.logout();
        this.globals.isLogued = false;

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngAfterViewInit(): void {
        $('.login').prop('style',"background-image: url('"+this.globals.urlPhotoLogin+"'); background-size: cover; background-position: top center;align-items: center;");
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.usuario.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.globals.isLogued = true;
                    this.router.navigate([data.url]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    this.submitted = false;
                    this.loginForm.get('usuario').setValue('');
                    this.loginForm.get('password').setValue('');
                    $.notify({
                        icon: 'fa fa-check',
                        title: ' Notificación',
                        message: 'Usuario o contraseña Incorrectos',
                        url: ''
                    },{
                        element: 'body',
                        type: 'inverse',
                        allow_dismiss: true,
                        placement: {
                            from: 'top',
                            align: 'center'
                        },
                        offset: {
                            x: 20,
                            y: 20
                        },
                        spacing: 10,
                        z_index: 1031,
                        delay: 2500,
                        timer: 1000,
                        url_target: '_blank',
                        mouse_over: false,
                        animate: {
                            enter: 'fadeInDown',
                            exit: 'fadeOutUp'
                        },
                        template:   '<div data-notify="container" class="alert alert-dismissible alert-{0} alert--notify" role="alert">' +
                                        '<span data-notify="icon"></span> ' +
                                        '<span data-notify="title">{1}</span> ' +
                                        '<span data-notify="message">{2}</span>' +
                                        '<div class="progress" data-notify="progressbar">' +
                                            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                                        '</div>' +
                                        '<a href="{3}" target="{4}" data-notify="url"></a>' +
                                        '<button type="button" aria-hidden="true" data-notify="dismiss" class="alert--notify__close">Close</button>' +
                                    '</div>'
                    });
                });
    }
}
