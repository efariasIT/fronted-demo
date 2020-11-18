import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './componentes/search/search.component';
import { CreateComponent } from './componentes/create/create.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'create', component: CreateComponent },
  { path: '', pathMatch: 'full', redirectTo: 'create' },
  { path: '**', pathMatch: 'full', redirectTo: 'create' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
