import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () =>
      import('./paises/paises.module').then((m) => m.PaisesModule),
  },
  // ¡¡¡¡¡LAZYLOAD!!!!!
  // path/cuando alguien entre a la ruta "selectpr", loadChildren/ carga a sus hijos y esos hijos
  // van a ser producto de import "('./paises/paises.module')", then/promesa/entonces cuando
  // los hijos esten cargados en memoria, cuando se cumpla la promesa devuelveme el "reactiveModule"
  // tuviste duda de porque "m.PaisesModule"? R: porque paises.module.ts ya esta cargada con las rutas de "paises-routing.module.ts"
  // explicacion de Lazy Load: https://www.youtube.com/watch?v=P3YUzXfa_FI
  {
    path: '**',
    redirectTo: 'selector',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
