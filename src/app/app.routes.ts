// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './components/car/car-list/car-list.component';
import { BookingListComponent } from './components/booking/booking-list/booking-list.component';
import { BookingFormComponent } from './components/booking/booking-form/booking-form.component';
import { BookingDetailsComponent } from './components/booking/booking-details/booking-details.component';

export const routes: Routes = [
  { path: 'cars', component: CarListComponent },
  { path: 'bookings', component: BookingListComponent },
  { path: 'bookings/new', component: BookingFormComponent },
  { path: 'bookings/:id', component: BookingDetailsComponent },
  { path: '', redirectTo: '/bookings', pathMatch: 'full' },
  { path: '**', redirectTo: '/bookings' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }