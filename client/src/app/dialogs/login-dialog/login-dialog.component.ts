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

  firstname: string;
  lastname: string;
  email: string;
  password: string; 

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) { 
    this.loggedIn = false;
    this.isCreatingPost = false;
    this.isCreatingAccount = false;
    this.isLoggingIn = false;
    this.firstname = '';
    this.lastname = '';
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
      alert("Logged In")
      this.loggedIn = true;
      this.isLoggingIn = false;
      this.firstname = res.firstname;
      this.lastname = res.lastname;
      this.dialogRef.close({
        'firstname': this.firstname,
        'lastname': this.lastname,
        'email': this.email,
        'loginSuccess': true
      })
    })
    .fail((res) => {
      console.log(res)
      alert("Login Failed: " + res.responseJSON.message);
    })
  }

  cancel() {
    this.dialogRef.close({'loginSuccess': false})
  }

}
