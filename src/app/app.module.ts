import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { AuthService } from '@services/auth.service';
import { FirestoreService } from '@services/firestore.service';
import { LogService } from './services/log.service';
import { HomeComponent } from './views/home/home.component';
import { ComponentsModule } from './components/components.module';
import { StateService } from './services/state.service';
import { ApptrayService } from './services/apptray.service';
import { YesNoPipe } from './feature/pipes/yes-no.pipe';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ComponentsModule,
  ],
  providers: [
    AuthService,
    LogService,
    FirestoreService,
    StateService,
    ApptrayService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
