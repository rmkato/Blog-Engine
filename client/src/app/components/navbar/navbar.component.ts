import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountCreationDialogComponent } from 'src/app/dialogs/account-creation-dialog/account-creation-dialog.component';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private dialog: MatDialog, public user: UserService) {}

  ngOnInit() {
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      autoFocus: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.loginSuccess == true) {
        this.user.username = res.username;
        this.user.loggedIn = true;
      }
    });
  }

  openAccountCreationDialog() {
    const dialogRef = this.dialog.open(AccountCreationDialogComponent, {
      autoFocus: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.accountCreationSuccess == true) {
        this.user.username = res.username;
        this.user.loggedIn = true;
      }
    })
  }

  logOut() {
    this.deleteLoginCookie();
    this.user.loggedIn = false;
    this.user.username = '';
    alert("Logged out")
  }

  deleteLoginCookie() {
    document.cookie = 'login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

}
