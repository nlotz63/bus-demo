import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Chapter03Module } from './chapter03/chapter03.module';
import { Module2Module } from './module2/module2.module';
import { Module3Module } from './module3/module3.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Chapter03Module,
    Module2Module,
    Module3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
