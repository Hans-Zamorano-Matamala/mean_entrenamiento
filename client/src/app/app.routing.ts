import { ModuleWithProviders } from '@angular/core';
import{ Routes, RouterModule } from '@angular/router';

//import user
import { UserEditComponent } from './components/user-edit.component';

import { HomeComponent } from './components/home.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artistas/:page', component: ArtistListComponent},
  {path: 'crear-artista', component: ArtistAddComponent},
  {path: 'editar-artista/:id', component: ArtistEditComponent},
  {path: 'artista/:id', component: ArtistDetailComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: ArtistListComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
