import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'src/environments/environment';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';



import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './Auth/store/auth.effects';
import { rootReducer } from './store/rootState';
import { ChatEffects } from './chat/store/chat.effects';
import { SharedEffects } from './shared/store/shared.effects';
import { VisitsComponent } from './visits/visits.component';
import { DateToTimestamp } from './shared/pipes/dateToTimestamp'
import { VisitsEffects } from './visits/store/visits.effects';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { HomeComponent } from './home/home.component';
import { StoreRouterConnectingModule } from '@ngrx/router-store'


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    SignupComponent,
    LoadingSpinnerComponent,
    HeaderComponent,
    VisitsComponent,
    DateToTimestamp,
    ProfilePageComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    StoreRouterConnectingModule.forRoot(),

    EffectsModule.forRoot([
      AuthEffects,
      ChatEffects,
      SharedEffects,
      VisitsEffects,
    ]),
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers:[],

  bootstrap: [AppComponent],
})
export class AppModule {}
