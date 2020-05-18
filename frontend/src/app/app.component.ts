import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PWA Check';

  ngOnInit() {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register(environment.baseUrl + '/service-worker.js')
    }
    // if(environment.production) {
    //   alert("Under development!")
    // }
  }
}
