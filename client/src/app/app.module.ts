import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountCreationDialogComponent } from './dialogs/account-creation-dialog/account-creation-dialog.component';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';
import { PostCreationDialogComponent } from './dialogs/post-creation-dialog/post-creation-dialog.component';
import { FilterDialogComponent } from './dialogs/filter-dialog/filter-dialog.component';
import { PostEditingDialogComponent } from './dialogs/post-editing-dialog/post-editing-dialog.component';
import { PostComponent } from './pages/post/post.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountCreationDialogComponent,
    LoginDialogComponent,
    PostCreationDialogComponent,
    FilterDialogComponent,
    PostEditingDialogComponent,
    PostComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AccountCreationDialogComponent, 
    LoginDialogComponent, 
    PostCreationDialogComponent, 
    FilterDialogComponent, 
    PostEditingDialogComponent]
})
export class AppModule { }
