import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { AuthGuard } from './Auth/auth.guard';
import { VisitsComponent } from './visits/visits.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'chat', canActivate: [AuthGuard], component: ChatComponent },
  { path: 'visits', canActivate: [AuthGuard], component: VisitsComponent },
  { path: 'profile', canActivate: [AuthGuard], component: ProfilePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
