import { TuiRootModule, TuiDialogModule, TuiAlertModule, TuiButtonModule } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { AppBarComponent } from './app-bar/app-bar.component';
import { TuiAppBarModule } from "@taiga-ui/addon-mobile";

@NgModule({
  declarations: [
    AppComponent,
    AppBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiButtonModule,
    TuiAlertModule,
    TuiAppBarModule
],
  providers: [ provideClientHydration() ],
  bootstrap: [AppComponent]
})
export class AppModule { }
