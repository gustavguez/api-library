import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { NgxGustavguezApiModule } from 'projects/gustavguez/ngx-api/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxGustavguezApiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
