import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { HttpClientModule } from "@angular/common/http";
import {
  NbLayoutModule,
  NbThemeModule,
  NbTreeGridModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbIconModule,
  NbToastrModule,
  NbToastrService
} from "@nebular/theme";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Test1Component } from "./test1/test1.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Test1Service } from "./test1/test1.service";

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
    NbCardModule,
    NbEvaIconsModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [Test1Service],
  bootstrap: [AppComponent]
})
export class AppModule {}
