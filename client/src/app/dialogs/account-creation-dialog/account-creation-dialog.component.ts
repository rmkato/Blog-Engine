import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as $ from 'jquery';

@Component({
  selector: 'app-account-creation-dialog',
  templateUrl: './account-creation-dialog.component.html',
  styleUrls: ['./account-creation-dialog.component.scss']
})
export class AccountCreationDialogComponent implements OnInit {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  constructor(public dialogRef: MatDialogRef<AccountCreationDialogComponent>) {
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.password = '';
  }

  ngOnInit() {
  }

  createAccount() {
    $.post('http://localhost:4000/user/signup', 
    {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'password': this.password
    })
    .done(() => {
      alert("Account created");
      this.dialogRef.close({
        'firstname': this.firstname,
        'lastname': this.lastname,
        'email': this.email,
        'accountCreationSuccess': true
      })
    })
    .fail((res) => {
      alert("Account creation failed: " + res.responseJSON.message);
    })
  }

  cancel() {
    this.dialogRef.close({'accountCreationSuccess': false})
  }

}
