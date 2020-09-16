import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as $ from 'jquery';
import { AccountCreationDialogComponent } from 'src/app/dialogs/account-creation-dialog/account-creation-dialog.component';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: boolean;

  firstname: string;
  lastname: string;
  email: string;
  password: string;

  posts: any[];
  postTitle: string;
  content: string;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.loggedIn = false;

    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.password = '';

    this.postTitle = '';
    this.content = '';

    this.getPosts();
  }

  getPosts() {
    var that = this;
    $.post('http://localhost:4000/post/retrieve', {})
      .done((res) => {
        that.posts = res.reverse();
      })
      .fail((res) => {
        console.log("Error retrieving posts: "+ res.responseJSON.message);
      })
  }

  logOut() {
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.password = '';
    this.loggedIn = false;
    alert("Logged out")
  }

  openAccountCreationDialog() {
    const dialogRef = this.dialog.open(AccountCreationDialogComponent, {
      autoFocus: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.accountCreationSuccess == true) {
        console.log(res)
        this.firstname = res.firstname;
        this.lastname = res.lastname;
        this.email = res.email;
        this.loggedIn = true;
      }
    })
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      autoFocus: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.loginSuccess == true) {
        console.log(res)
        this.firstname = res.firstname;
        this.lastname = res.lastname;
        this.email = res.email;
        this.loggedIn = true;
      }
    })
  }

}