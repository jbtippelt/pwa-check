import { Component, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PWA Check';
  mobile = false;

  ngOnInit() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(environment.baseUrl + '/service-worker.js')
    }
    if (environment.production) {
      alert("Under development!")
    }
    if (window.screen.width <= 500) {
      this.mobile = true;
    }
  }

  @HostListener("window:resize", [])
  private onResize() {
    if (window.screen.width <= 500) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }
}
