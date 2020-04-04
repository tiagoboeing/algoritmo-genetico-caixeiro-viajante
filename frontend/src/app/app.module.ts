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
  NbTreeGridModule,
  NbSidebarModule,
  NbWindowModule,
  NbStepperModule,
} from "@nebular/theme";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Test1Component } from "./test1/test1.component";
import { Test1Service } from "./test1/test1.service";
import { CommonModule } from "@angular/common";
import { ResultComponent } from "./test1/result/result.component";

@NgModule({
  declarations: [AppComponent, Test1Component, ResultComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NbButtonModule,
    NbCardModule,
    NbEvaIconsModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbStepperModule,
    NbThemeModule.forRoot({ name: "dark" }),
    NbToastrModule.forRoot(),
    NbTreeGridModule,
    NbTreeGridModule,
    NbWindowModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [Test1Service],
  bootstrap: [AppComponent],
})
export class AppModule {}
