import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routing } from './routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { LineChartModule } from './charts/linechart';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    LineChartModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
