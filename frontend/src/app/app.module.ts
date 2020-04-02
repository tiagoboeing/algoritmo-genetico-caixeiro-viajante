import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import {
  NbLayoutModule,
  NbThemeModule,
  NbTreeGridModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbIconModule
} from "@nebular/theme";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Test1Component } from "./test1/test1.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, Test1Component],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "dark" }),
    NbLayoutModule,
    NbTreeGridModule,
    NbCardModule,
    NbEvaIconsModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
