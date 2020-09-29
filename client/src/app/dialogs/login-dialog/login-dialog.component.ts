import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as $ from 'jquery';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  loggedIn: boolean;
  isCreatingPost: boolean; 
  isLoggingIn: boolean;
  isCreatingAccount: boolean;

  username: string;
  password: string; 

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) { 
    this.loggedIn = false;
    this.isCreatingPost = false;
    this.isCreatingAccount = false;
    this.isLoggingIn = false;
    this.username = '';
    this.password = '';
  }

  ngOnInit() {
  }

  logIn() {
    $.post('http://localhost:4000/user/login', 
    {
      'username': this.username,
      'password': this.password
    })
    .done((res) => {
      this.loggedIn = true;
      this.isLoggingIn = false;
      this.dialogRef.close({
        'username': this.username,
        'loginSuccess': true
      });
      document.cookie = res.cookie;
      alert("Logged In")
    })
    .fail((res) => {
      alert("Login Failed: " + res.responseJSON.message);
    })
  }

  cancel() {
    this.dialogRef.close({'loginSuccess': false});
  }

}
