import { Component, OnInit } from '@angular/core';
import { strictEqual } from 'assert';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: boolean;
  isCreatingPost: boolean; 
  isLoggingIn: boolean;
  isCreatingAccount: boolean;

  firstname: string;
  lastname: string;
  email: string;
  password: string;

  posts: any[];
  postTitle: string;
  content: string;

  constructor() { }

  ngOnInit() {
    this.loggedIn = false;
    this.isCreatingPost = false;
    this.isCreatingAccount = false;
    this.isLoggingIn = false;

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
      .fail((err) => {
        console.log("Error retrieving posts: ${err}")
      })
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
      this.loggedIn = true;
      this.isCreatingAccount = false;
    })
    .fail((res) => {
      alert("Account creation failed: " + res.responseJSON.message);
    })
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
    })
    .fail((res) => {
      console.log(res)
      alert("Login Failed: " + res.responseJSON.message);
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

  toggleAccountCreation() {
    this.isCreatingAccount = true;
  }

  toggleLogin() {
    this.isLoggingIn = true;
  }
  
  cancelCreationOrLogin() {
    this.isCreatingAccount = false;
    this.isLoggingIn = false;
  }

}
