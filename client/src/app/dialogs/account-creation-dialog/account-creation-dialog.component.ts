import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as $ from 'jquery';

@Component({
  selector: 'app-account-creation-dialog',
  templateUrl: './account-creation-dialog.component.html',
  styleUrls: ['./account-creation-dialog.component.scss']
})
export class AccountCreationDialogComponent implements OnInit {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(public dialogRef: MatDialogRef<AccountCreationDialogComponent>) {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
  }

  ngOnInit() {
  }

  createAccount() {
    $.post('http://localhost:4000/user/signup', 
    {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'email': this.email,
      'password': this.password
    })
    .done((res) => {
      this.dialogRef.close({
        'firstName': this.firstName,
        'lastName': this.lastName,
        'email': this.email,
        'accountCreationSuccess': true
      });
      document.cookie = res.cookie;
      alert("Account created");
      console.log(document.cookie);
    })
    .fail((res) => {
      alert("Account creation failed: " + res.responseJSON.message);
    })
  }

  cancel() {
    this.dialogRef.close({'accountCreationSuccess': false})
  }

}
