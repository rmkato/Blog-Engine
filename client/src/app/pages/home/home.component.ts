import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as $ from 'jquery';
import { AccountCreationDialogComponent } from 'src/app/dialogs/account-creation-dialog/account-creation-dialog.component';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';
import { PostCreationDialogComponent } from 'src/app/dialogs/post-creation-dialog/post-creation-dialog.component';
import { PostEditingDialogComponent } from 'src/app/dialogs/post-editing-dialog/post-editing-dialog.component';
import { FilterDialogComponent } from 'src/app/dialogs/filter-dialog/filter-dialog.component';
 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: boolean;

  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;

  posts: any[];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.loggedIn = false;
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.password = '';

    this.checkLoginCookie();
    this.getPosts();
  }

  checkLoginCookie() {
    if (document.cookie) {
      $.post('http://localhost:4000/user/verifyCookie', {'cookie': document.cookie})
        .done((res) => {
          this.username = res.username;
          this.loggedIn = true;
          this.deleteLoginCookie();
          document.cookie = res.cookie;
        })
        .fail((res) => {
          console.log("login cookie failed to verify");
          this.deleteLoginCookie();
        })
      }
  }

  deleteLoginCookie() {
    document.cookie = 'login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  getPosts() {
    this.posts = [];
    $.post('http://localhost:4000/post/retrieve', {})
      .done((res) => {
        this.posts = res.reverse();
      })
      .fail((res) => {
        console.log("Error retrieving posts: "+ res.responseJSON.message);
      })
  }

  logOut() {
    this.clearInputFields();
    this.deleteLoginCookie();
    this.loggedIn = false;
    alert("Logged out")
  }

  clearInputFields() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
  }

  openAccountCreationDialog() {
    const dialogRef = this.dialog.open(AccountCreationDialogComponent, {
      autoFocus: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.accountCreationSuccess == true) {
        this.username = res.username;
        this.loggedIn = true;
        this.clearInputFields();
      }
    })
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      autoFocus: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.loginSuccess == true) {
        this.username = res.username;
        this.loggedIn = true;
        this.clearInputFields();
      }
    });
  }

  openPostCreationDialog() {
    const dialogRef = this.dialog.open(PostCreationDialogComponent, {
      height: '60%',
      width: '75%',
      autoFocus: true,
      disableClose: true,
      data: {
        'username': this.username
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPosts()
    })
  }

  openPostDeletionDialog(id: string) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      $.post('http://localhost:4000/post/delete', {
        id: id
      })
      .done((res) => {
        this.getPosts();
      })
      .fail((res) => {
        alert("Post not deleted, error: "+res.responseJSON.message)
      })
    }
  }

  openPostEditingDialog(post: any) {
    const dialogRef = this.dialog.open(PostEditingDialogComponent, {
      height: '60%',
      width: '75%',
      autoFocus: true,
      disableClose: true,
      data: {
        title: post.title,
        content: post.content,
        tags: post.tags,
        id: post._id
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getPosts()
    })
  }

  openFilterDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      height: '60%',
      width: '75%',
      autoFocus: true,
      disableClose: true
    })
  }

}