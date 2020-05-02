import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { NotificationComponent } from './notification/notification.component';


const routes: Routes = [
  { path: 'info', component: InfoComponent },
  { path: 'notification', component: NotificationComponent },
  { path: '',   redirectTo: '/info', pathMatch: 'full' },
  { path: '**', component: InfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
