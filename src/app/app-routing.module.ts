/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home/:status',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'loginPage', loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPagePageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  { path: 'forgotpassword', loadChildren: () => import('./forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordPageModule) },
  { path: 'resetPassword', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },
  { path: 'addcard', loadChildren: () => import('./addcard/addcard.module').then(m => m.AddcardPageModule) },
  { path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule) },
  { path: 'pickup', loadChildren: () => import('./pickup/pickup.module').then(m => m.PickupPageModule) },
  { path: 'fareestimate', loadChildren: () => import('./fareestimate/fareestimate.module').then(m => m.FareestimatePageModule) },
  { path: 'promo', loadChildren: () => import('./promo/promo.module').then(m => m.PromoPageModule) },
  { path: 'requestride', loadChildren: () => import('./requestride/requestride.module').then(m => m.RequestridePageModule) },
  { path: 'changepayment', loadChildren: () => import('./changepayment/changepayment.module').then(m => m.ChangepaymentPageModule) },
  { path: 'profilepage', loadChildren: () => import('./profilepage/profilepage.module').then(m => m.ProfilepagePageModule) },
  { path: 'bookingconfirmation', loadChildren: () => import('./bookingconfirmation/bookingconfirmation.module').then(m => m.BookingconfirmationPageModule) }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
