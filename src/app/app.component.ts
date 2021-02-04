import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';

declare let gtag: Function;
const isProduction = environment.production

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Rework';

  constructor( public router: Router ){

    if ( isProduction ) {

      this.router.events.subscribe( event => {

        if ( event instanceof NavigationEnd ) {
  
          gtag('config', 'G-5BTF4RYB0S', {
  
            page_path: event.urlAfterRedirects
  
          });
  
        }
  
      });

    }

  }

}
