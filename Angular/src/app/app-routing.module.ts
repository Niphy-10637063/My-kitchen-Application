import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core/authentication/authentication.guard';

const routes: Routes = [
  {
    path: 'my-kitchen',
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./top-navigation/top-navigation.module').then(
            (m) => m.TopNavigationModule
          ),
      },
      // {
      //   path: ':id?',
      //   loadChildren: () =>
      //     import('./top-navigation/top-navigation.module').then(
      //       (m) => m.TopNavigationModule
      //     ),
      // },
    ],
  },
  {
    path: '',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'unauthorized-access-401',
    loadChildren: () =>
      import('./unauthorised/unauthorised.module').then(
        (m) => m.UnauthorisedModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./page-not-found/page-not-found.module').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules, initialNavigation:'enabledBlocking' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
