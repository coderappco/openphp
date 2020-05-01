import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * @var global
 */
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  public _from:string  = "top";
  public _align:string = "center";
  public _timer:number = 1000;
  public _delay:number = 2500;

  constructor() { }

  /**
   * showMessage
   * @param string message
   */
  showMessage(message: string) {
    $.notify({
      icon: 'fa fa-check',
      title: ' Notificación',
      message: message,
      url: ''
    },{
      element: 'body',
      type: 'inverse',
      allow_dismiss: true,
      placement: {
        from: this._from,
        align: this._align
      },
      offset: {
        x: 20,
        y: 20
      },
      spacing: 10,
      z_index: 1031,
      delay: this._delay,
      timer: this._timer,
      url_target: '_blank',
      mouse_over: false,
      animate: {
        enter: 'fadeInDown',
        exit: 'fadeOutUp'
      },
      template: '<div data-notify="container" class="alert alert-dismissible alert-{0} alert--notify" role="alert">' +
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
  }
}