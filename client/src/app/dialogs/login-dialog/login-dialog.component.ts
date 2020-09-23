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

  firstName: string;
  lastName: string;
  email: string;
  password: string; 

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) { 
    this.loggedIn = false;
    this.isCreatingPost = false;
    this.isCreatingAccount = false;
    this.isLoggingIn = false;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
  }

  ngOnInit() {
  }

  logIn() {
    $.post('http://localhost:4000/user/login', 
    {
      'email': this.email,
      'password': this.password
    })
    .done((res) => {
      this.loggedIn = true;
      this.isLoggingIn = false;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.dialogRef.close({
        'firstName': this.firstName,
        'lastName': this.lastName,
        'email': this.email,
        'loginSuccess': true
      });
      console.log(res.cookie);
      document.cookie = res.cookie;
      alert("Logged In")
      console.log(document.cookie);
    })
    .fail((res) => {
      alert("Login Failed: " + res.responseJSON.message);
    })
  }

  cancel() {
    this.dialogRef.close({'loginSuccess': false});
  }

}
