import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthLoginGuard } from './guards/auth-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tracker',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canLoad: [ AuthGuard ]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canLoad: [ AuthGuard ]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [ AuthLoginGuard ]
  },
  {
    path: 'tracker',
    loadChildren: () => import('./pages/tracker/tracker.module').then( m => m.TrackerPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule),
    canLoad: [ AuthGuard ]
  },
  {
    path: 'manage-admin',
    loadChildren: () => import('./pages/manage-admin/manage-admin.module').then( m => m.ManageAdminPageModule),
    canLoad: [ AuthGuard ]
  },
  {
    path: "**",
    redirectTo: "tracker"
  },
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
