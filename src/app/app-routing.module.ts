import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsDetailsComponent } from './components/notifications-details/notifications-details.component';

const routes: Routes = [
  {
    path: 'notifications/:id',
    component: NotificationsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
