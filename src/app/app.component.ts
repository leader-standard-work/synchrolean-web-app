import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  brand: string = 'lean';
  isCollapsed: boolean = true;

  /**
   * We could use AppComponent for login logic and inject the
   * required services to handle this since the navbar includes 
   * a login button. 
   */
  constructor() {

  }
}
