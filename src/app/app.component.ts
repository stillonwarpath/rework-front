import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Rework';

  constructor( public router: Router ){

    this.router.events.subscribe( event => {

      if ( event instanceof NavigationEnd ) {

        gtag('config', 'G-5BTF4RYB0S', {

          page_path: event.urlAfterRedirects

        });

      }

    });

  }

}
