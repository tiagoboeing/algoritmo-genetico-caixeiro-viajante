import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbThemeModule,
  NbToastrModule,
  NbTreeGridModule
} from "@nebular/theme";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Test1Component } from "./test1/test1.component";
import { Test1Service } from "./test1/test1.service";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [AppComponent, Test1Component],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NbThemeModule.forRoot({ name: "dark" }),
    NbLayoutModule,
    NbTreeGridModule,
    NbEvaIconsModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [Test1Service],
  bootstrap: [AppComponent]
})
export class AppModule {}
